import getActiveTab from './getActiveTab'

export const request = () => new Promise(async (ok) => {
  const activeTab = await getActiveTab()
  chrome.tabs.sendMessage(activeTab.id, {
    target: 'content',
    action: 'getPageTitle',
  }, (response) => {
    ok(response)
  })
})

export const response = () => document.title
