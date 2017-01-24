import thenChrome from 'then-chrome'
import config from './config'
import uploadGyazo from './libs/uploadGyazo'
import MessageListener from './libs/MessageListener'

const createScrapboxPage = async ({title, url, body}) => {
  const projectUrl = 'https://scrapbox.io/' + await config.projectName()
  thenChrome.tabs.create({
    url: projectUrl + '/' + encodeURIComponent(title) + '?body='
      + encodeURIComponent(`[${title} ${url}]\n${body}`)
  })
}

const getImagesOnPage = async () => {
  return await thenChrome.tabs.executeScript({
    code: `(() => {
      const ogImage = document.querySelector('meta[property="og:image"]')
      const imageTags = document.querySelectorAll('img')
      return [ogImage, ...imageTags].map((tag) => tag && (tag.content || tag.src))
    })()`
  })
}

const onMessageListener = new MessageListener('main')
onMessageListener.add('fetchApi', (message, sender, sendResponse) => {
  window.fetch(config.getApiUrl(message.apiType), {credentials: 'include'})
    .then((res) => res.json())
    .then(sendResponse)
})
onMessageListener.add('imageSelected', async (message, sender, sendResponse) => {
  const tab = (await thenChrome.tabs.query({currentWindow: true, active: true}))[0]
  const responseURL = await uploadGyazo(message.imageUrl, tab)
  const {text, title} = message
  createScrapboxPage({
    title: title,
    body: `[${responseURL} ${tab.url}]\n${text}`,
    url: tab.url
  })
})
onMessageListener.add('getQuotedText', async (message, sender, sendResponse) => {
  let quotedText = (await thenChrome.tabs.executeScript({
    code: 'window.getSelection().toString();'
  })).join('') || ''
  if (quotedText) {
    quotedText = `> ${quotedText}`
  }
  sendResponse(quotedText)
})

onMessageListener.add('getImages', async (message, sender, sendResponse) => {
  const capture = await thenChrome.tabs.captureVisibleTab({format: 'png'})
  const images = [capture].concat((await getImagesOnPage())[0]).filter((_) => !!_)
  sendResponse(images)
})

onMessageListener.add('getPageTitle', async (message, sender, sendResponse) => {
  const title = (await thenChrome.tabs.executeScript({
    code: 'document.title'
  }))[0] || ''
  sendResponse(title)
})

chrome.runtime.onMessage.addListener(onMessageListener.listen.bind(onMessageListener))

chrome.browserAction.setPopup({popup: '/popup/popup.html'})
