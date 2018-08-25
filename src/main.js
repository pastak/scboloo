import thenChrome from 'then-chrome'
import config from './config'
import uploadGyazo from './libs/uploadGyazo'
import createScrapboxPage from './libs/createScrapboxPage'
import MessageListener from './libs/MessageListener'
import {request as getImagesOnPage} from './libs/getImagesOnPage'
import {request as getPageTitle} from './libs/getPageTitle'
import getActiveTab from './libs/getActiveTab'
import getTags from './libs/getTags'

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
  // const tags = []

  if (imageUrl) {
    const responseURL = await uploadGyazo(imageUrl, tab)
    body.push(`[${responseURL} ${tab.url}]`)
  }

  body.push(text)
  
  console.log('tab.url=' + tab.url)
  console.log('originalTitle=' + originalTitle)

  const tags = getTags(tab.url, originalTitle)
  
  console.log('tags=' + tags.toString())

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
