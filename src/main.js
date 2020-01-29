import thenChrome from 'then-chrome'
import config from './config'
import uploadGyazo from './libs/uploadGyazo'
import createScrapboxPage from './libs/createScrapboxPage'
import MessageListener from './libs/MessageListener'
import {request as getImagesOnPage} from './libs/getImagesOnPage'
import {request as getPageTitle} from './libs/getPageTitle'
import getActiveTab from './libs/getActiveTab'

const convertDataUrl = (srcUrl) => new Promise((resolve) => {
  const xhr = new window.XMLHttpRequest()
      xhr.open('GET', srcUrl, true)
      xhr.responseType = 'blob'
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          let mineType = xhr.response.type
          if (/png$/.test(srcUrl)) {
            mineType = 'image/png'
          } else if (/jpe?g$/.test(srcUrl)) {
            mineType = 'image/jpeg'
          } else if (/gif$/.test(srcUrl)) {
            mineType = 'image/gif'
          }
          const blob = new window.Blob([xhr.response], {type: mineType})
          const fileReader = new FileReader()
          fileReader.onload = function (e) {
            resolve(fileReader.result);
          }
          fileReader.readAsDataURL(blob)
        }
      }
      xhr.send()
})

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
  let {text, title, imageUrl, projectName} = message
  const originalTitle = await getPageTitle()
  const tab = await getActiveTab()
  const body = [`[${originalTitle} ${tab.url}]`]
  if (imageUrl) {
    if (/^https?/.test(imageUrl)) {
      imageUrl = await convertDataUrl(imageUrl)
    }
    const responseURL = await uploadGyazo(imageUrl, tab)
    body.push(`[${responseURL} ${tab.url}]`)
  }
  body.push(text)
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
