chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.captureVisibleTab(tab.windowId, {format: 'png'}, (data) => {
    chrome.tabs.create({url: data})
  })
})
