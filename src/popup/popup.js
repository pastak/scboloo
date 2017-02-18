import config from '../config'

const selectElm = document.querySelector('#projectSelect')
const imageListDiv = document.querySelector('#imageList')

document.querySelector('#createButton').addEventListener('click', (e) => {
  e.preventDefault()
  chrome.runtime.sendMessage(chrome.runtime.id, {
    target: 'main',
    action: 'createScrapboxPage',
    projectName: selectElm.value,
    imageUrl: document.querySelector('.selected').src,
    text: document.querySelector('#scrapboxText').value,
    title: document.querySelector('#pageTitle').value
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
  action: 'getPageTitle'
}, (title) => {
  document.querySelector('#pageTitle').value = title
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

chrome.runtime.sendMessage(chrome.runtime.id, {
  target: 'main',
  action: 'fetchApi',
  apiType: 'getProjects'
}, async (res) => {
  const {projects} = res
  projects.forEach((project) => {
    const optionElm = document.createElement('option')
    optionElm.value = project.name
    optionElm.textContent = project.displayName
    selectElm.appendChild(optionElm)
  })
  selectElm.value = (await config.projectName()) || projects[0].name
})
