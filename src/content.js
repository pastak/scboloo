import thenChrome from 'then-chrome'
import MessageListener from './libs/MessageListener'
import {response as getImagesOnPage} from './libs/getImagesOnPage'
import {response as getPageTitle} from './libs/getPageTitle'

const onMessageListener = new MessageListener('content')

onMessageListener.add('getImages', async (message, sender, sendResponse) => {
  sendResponse(getImagesOnPage())
})

onMessageListener.add('getPageTitle', async (message, sender, sendResponse) => {
  sendResponse(getPageTitle())
})

chrome.runtime.onMessage.addListener(onMessageListener.listen.bind(onMessageListener))
