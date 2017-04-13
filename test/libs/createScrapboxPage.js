import test from 'ava'
import createScrapboxPage from '../../src/libs/createScrapboxPage'

test.beforeEach((t) => {
  chrome.flush()
})

test('createScrapboxPage.js', async (t) => {
  t.plan(2)
  const url = 'https://example.com'
  const {title, body, projectName} = {
    title: 'お試し',
    body: `['お試し' ${url}]\nhoge`,
    projectName: 'test'
  }
  await createScrapboxPage({title, body, projectName})
  t.truthy(chrome.tabs.create.calledOnce)
  t.truthy(chrome.tabs.create.withArgs({
    url: `https://scrapbox.io/test/${encodeURIComponent('お試し')}?body=${encodeURIComponent(body)}`
  }).calledOnce)
})
