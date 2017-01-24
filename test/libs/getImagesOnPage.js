import test from 'ava'
import getImagesOnPage from '../../src/libs/getImagesOnPage'

test('getImagesOnPage.js', (t) => {
  getImagesOnPage()
  t.truthy(chrome.tabs.executeScript.calledOnce)
})
