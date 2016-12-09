function createScrapboxPage (title, body) {
  const projectUrl = 'https://scrapbox.io/pastak'
  chrome.tabs.create({url: projectUrl + '/new'}, (tab) => {
    window.setTimeout(() => chrome.tabs.sendMessage(tab.id, {title: title, body: body}), 3000)
  })
}

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, (image) => {
    const endPoint = 'https://upload.gyazo.com/api/upload/easy_auth'
    const clientId = 'df9edab530e84b4c56f9fcfa209aff1131c7d358a91d85cc20b9229e515d67dd'
    const data = [
      ['client_id', clientId],
      ['title', tab.title],
      ['referer_url', tab.url],
      ['image_url', image],
      ['desc', '']
    ]
    window.fetch(endPoint, {
      method: 'POST',
      body: data.map((a) => encodeURIComponent(a[0]) + '=' + encodeURIComponent(a[1])).join('&'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      }
    })
    .then((res) => res.json())
    .then((json) => {
      let xhr = new window.XMLHttpRequest()
      xhr.open('GET', json.get_image_url)
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return
        if (xhr.responseURL) {
          createScrapboxPage(tab.title, `[${xhr.responseURL}]`)
        }
      }
      xhr.send()
    })
  })
})
