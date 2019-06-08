import getActiveTab from './getActiveTab'

export const request = () => new Promise(async (resolve) => {
  const activeTab = await getActiveTab()
  chrome.tabs.sendMessage(activeTab.id, {
    target: 'content',
    action: 'getPageTitle'
  }, (response) => {
    resolve(response)
  })
})

export const response = () => document.title
