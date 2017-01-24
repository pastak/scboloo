import thenChrome from 'then-chrome'
import config from './config'
import uploadGyazo from './libs/uploadGyazo'
import createScrapboxPage from './libs/createScrapboxPage'
import MessageListener from './libs/MessageListener'
import getImagesOnPage from './libs/getImagesOnPage'

const onMessageListener = new MessageListener('main')
onMessageListener.add('fetchApi', (message, sender, sendResponse) => {
  window.fetch(config.getApiUrl(message.apiType), {credentials: 'include'})
    .then((res) => res.json())
    .then(sendResponse)
})
onMessageListener.add('imageSelected', async (message, sender, sendResponse) => {
  const tab = (await thenChrome.tabs.query({currentWindow: true, active: true}))[0]
  const responseURL = await uploadGyazo(message.imageUrl, tab)
  const text = message.text
  createScrapboxPage({
    title: tab.title,
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

chrome.runtime.onMessage.addListener(onMessageListener.listen.bind(onMessageListener))

chrome.browserAction.setPopup({popup: '/popup/popup.html'})
