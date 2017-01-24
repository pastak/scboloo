import test from 'ava'
import MessageListener from '../../src/libs/MessageListener'

test.beforeEach(t => chrome.runtime.sendMessage.flush())

test('MessageListener listen works fine', t => {
  t.plan(1)
  const onMessageListener = new MessageListener('main')
  onMessageListener.add('test', (message) => t.is(message.test, 'hoge'))
  chrome.runtime.onMessage.addListener(onMessageListener.listen.bind(onMessageListener))
  chrome.runtime.onMessage.dispatch({
    target: 'main',
    action: 'test',
    test: 'hoge'
  })
})

test('MessageListener listen not called different action', t => {
  t.plan(2)
  const onMessageListener = new MessageListener('main')
  onMessageListener.add('test', () => t.pass())
  onMessageListener.add('test2', () => t.pass())
  onMessageListener.add('test', () => t.pass())
  onMessageListener.add('_test', () => t.pass())
  chrome.runtime.onMessage.addListener(onMessageListener.listen.bind(onMessageListener))
  chrome.runtime.onMessage.dispatch({
    target: 'main',
    action: 'test'
  })
})

test('MessageListener listen not called different target', t => {
  t.plan(0)
  const onMessageListener = new MessageListener('different')
  onMessageListener.add('test', () => t.pass())
  chrome.runtime.onMessage.addListener(onMessageListener.listen.bind(onMessageListener))
  chrome.runtime.onMessage.dispatch({
    target: 'main',
    action: 'test'
  })
})
