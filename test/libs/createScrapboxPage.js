import test from 'ava'
import createScrapboxPage from '../../src/libs/createScrapboxPage'

test.beforeEach((t) => {
  chrome.flush()
})

test('createScrapboxPage.js', async (t) => {
  t.plan(2)
  const {title, url, body, projectName} = {
    title: 'お試し',
    url: 'https://example.com/example',
    body: 'hoge',
    projectName: 'test'
  }
  await createScrapboxPage({title, url, body, projectName})
  t.truthy(chrome.tabs.create.calledOnce)
  t.truthy(chrome.tabs.create.withArgs({
    url: `https://scrapbox.io/test/${encodeURIComponent('お試し')}?body=${encodeURIComponent(`[${title} ${url}]\n${body}`)}`
  }).calledOnce)
})
