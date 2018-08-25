import thenChrome from 'then-chrome'
import config from './config'
import uploadGyazo from './libs/uploadGyazo'
import createScrapboxPage from './libs/createScrapboxPage'
import MessageListener from './libs/MessageListener'
import {request as getImagesOnPage} from './libs/getImagesOnPage'
import {request as getPageTitle} from './libs/getPageTitle'
import getActiveTab from './libs/getActiveTab'

const onMessageListener = new MessageListener('main')
onMessageListener.add('fetchApi', (message, sender, sendResponse) => {
  window.fetch(config.getApiUrl(message.apiType), {credentials: 'include', mode: 'cors'})
    .then((res) => res.json())
    .then(sendResponse)
    .catch((e) => {
      const xhr = new window.XMLHttpRequest()
      xhr.withCredentials = true
      xhr.open('GET', config.getApiUrl(message.apiType))
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return
        sendResponse(JSON.parse(xhr.responseText))
      }
      xhr.send()
    })
})
onMessageListener.add('createScrapboxPage', async (message, sender, sendResponse) => {
  const {text, title, imageUrl, projectName} = message
  const originalTitle = await getPageTitle()
  const tab = await getActiveTab()
  const body = [`[${originalTitle} ${tab.url}]`]
  const tags = [];
  const url = tab.url;
  if (imageUrl) {
    const responseURL = await uploadGyazo(imageUrl, tab)
    body.push(`[${responseURL} ${tab.url}]`)
  }

  if (url.match(/shakyo/) || url.match(/ehimesvc/)) tags.push("#ボランティア")
  if (originalTitle.match(/ボランティア/)) tags.push('#ボランティア')
  if (originalTitle.match(/募集/)) tags.push('#募集中')
  if (originalTitle.match(/義援金/)) tags.push('#義援金')
  if (originalTitle.match(/寄付金/)) tags.push('#寄付金')
  if (originalTitle.match(/支援金/)) tags.push('#支援金')
  if (originalTitle.match(/復興支援/)) tags.push('#復興支援')
  if (url.match(/uwajima/)) tags.push('#宇和島市')
  if (url.match(/seiyo/)) tags.push('#西予市')
  if (url.match(/ozu/)) tags.push('#大洲市')
  if (url.match(/matsuyama/)) tags.push('#松山市')
  if (url.match(/imabari/)) tags.push('#今治市')
  if (url.match(/matsuno/)) tags.push('#松野町')
  if (url.match(/kihoku/)) tags.push('#鬼北町')
  if (url.match(/kamijima/)) tags.push('#上島町')
  if (url.match(/ainan/)) tags.push('#愛南町')
  if (url.match(/pref\.ehime/)) tags.push('#愛媛県')

  body.push(text)
  Array.prototype.push.apply(body, tags)

  createScrapboxPage({
    title,
    projectName,
    body: body.join('\n')
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
  let capture = null
  try {
    capture = await thenChrome.tabs.captureVisibleTab({format: 'png'})
  } catch (e) {}
  const images = [capture].concat((await getImagesOnPage())).filter((_) => !!_)
  sendResponse(images)
})

onMessageListener.add('getPageTitle', async (message, sender, sendResponse) => {
  const title = await getPageTitle()
  sendResponse(title)
})

chrome.runtime.onMessage.addListener(onMessageListener.listen.bind(onMessageListener))
