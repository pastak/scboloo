import thenChrome from 'then-chrome'
import config from './config'

const createScrapboxPage = async ({title, url, body}) => {
  const projectUrl = 'https://scrapbox.io/' + await config.projectName()
  thenChrome.tabs.create({
    url: projectUrl + '/' + title + '?body='
      + encodeURIComponent(`[${title} ${url}]\n${body}`)
  })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchApi') {
    window.fetch(config.getApiUrl(message.apiType), {credentials: 'include'})
      .then((res) => res.json())
      .then(sendResponse)
  }
  return true
})

chrome.browserAction.onClicked.addListener(async (tab) => {
  if (!config.projectName()) {
    window.alert('Please select project to post on extension\'s Option Page')
    return
  }
  let quotedText = (await thenChrome.tabs.executeScript({
    code: 'window.getSelection().toString();'
  })).join('') || ''
  if (quotedText) {
    quotedText = `\n> ${quotedText}`
  }
  const image = await thenChrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'})
  const endPoint = 'https://upload.gyazo.com/api/upload/easy_auth'
  const clientId = 'df9edab530e84b4c56f9fcfa209aff1131c7d358a91d85cc20b9229e515d67dd'
  const data = [
    ['client_id', clientId],
    ['title', tab.title],
    ['referer_url', tab.url],
    ['image_url', image],
    ['desc', '']
  ]
  const res = await window.fetch(endPoint, {
    method: 'POST',
    body: data.map((a) => encodeURIComponent(a[0]) + '=' + encodeURIComponent(a[1])).join('&'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
  })
  const json = await res.json()
  let xhr = new window.XMLHttpRequest()
  xhr.open('GET', json.get_image_url)
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return
    if (xhr.responseURL) {
      createScrapboxPage({
        title: tab.title,
        body: `[${xhr.responseURL} ${tab.url}]${quotedText}`,
        url: tab.url
      })
    }
  }
  xhr.send()
})
