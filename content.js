chrome.runtime.onMessage.addListener((message) => {
  const title = message.title
  const body = message.body
  const waitForTextarea = (ok) => {
    const textarea = document.getElementById('text-input')
    if (textarea) {
      console.log('aaaa')
      ok(textarea)
    } else {
      window.setTimeout(() => waitForTextarea(ok), 50)
    }
  }
  new Promise(waitForTextarea).then((textarea) => {
    textarea.focus()
    document.execCommand('insertText', false, title + '\n' + body)
  })
})
