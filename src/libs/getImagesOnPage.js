import getActiveTab from './getActiveTab'

export const request = () => new Promise(async (resolve) => {
  const activeTab = await getActiveTab()
  chrome.tabs.sendMessage(activeTab.id, {
    target: 'content',
    action: 'getImages'
  }, (response) => {
    resolve(response)
  })
})

export const response = () => {
  return Array.from(
    document.querySelectorAll('meta[property="og:image"]')
  )
  .concat(
    Array.from(document.querySelectorAll('img'))
  )
  .map(
    (tag) => tag && (tag.content || tag.src)
  )
}
