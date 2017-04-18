import thenChrome from 'then-chrome'

export default async () => {
  const tabs = await thenChrome.tabs.query({currentWindow: true, active: true})
  return tabs[0]
}
