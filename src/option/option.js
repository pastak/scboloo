import config from '../config'
const selectElm = document.querySelector('#projectSelect')

const showMessage = (message, msec = 1500) => {
  const messageElm = document.querySelector('#message')
  messageElm.textContent = message
  window.setTimeout(() => { messageElm.textContent = '' }, msec)
}

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
  selectElm.value = await config.projectName()
  selectElm.addEventListener('change', (elm) => {
    config.projectName(elm.target.value)
      .then(() => showMessage('saved'))
  })
})
