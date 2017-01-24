import thenChrome from 'then-chrome'

const imageListDiv = document.querySelector('#imageList')

document.querySelector('#createButton').addEventListener('click', (e) => {
  e.preventDefault()
  chrome.runtime.sendMessage(chrome.runtime.id, {
    target: 'main',
    action: 'imageSelected',
    imageUrl: document.querySelector('.selected').src,
    text: document.querySelector('#scrapboxText').value
  })
  window.close()
})

chrome.runtime.sendMessage(chrome.runtime.id, {
  target: 'main',
  action: 'getQuotedText'
}, (text) => {
  document.querySelector('#scrapboxText').value = text
})

chrome.runtime.sendMessage(chrome.runtime.id, {
  target: 'main',
  action: 'getImages'
}, (images) => {
  images.forEach((imageUrl, index) => {
    const imageElm = document.createElement('img')
    imageElm.src = imageUrl
    if (index === 0) imageElm.classList.add('selected')
    imageListDiv.appendChild(imageElm)
    imageElm.addEventListener('click', (e) => {
      const imageElm = e.target
      if (imageElm.classList.contains('selected')) return
      const selected = document.querySelector('.selected')
      selected.classList.remove('selected')
      imageElm.classList.add('selected')
    })
  })
})
