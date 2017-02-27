import thenChrome from 'then-chrome'

export default async () => {
  return (await thenChrome.tabs.executeScript({
    code: 'document.title'
  }))[0] || ''
}
