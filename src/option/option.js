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
  const selectedProject = await config.projectName()
  if (selectedProject) {
    selectElm.value = selectedProject
  } else {
    const unselectedElm = document.createElement('option')
    unselectedElm.selected = true
    unselectedElm.textContent = '--Please Select Default Project--'
    selectElm.insertBefore(unselectedElm, selectElm.children[0])
  }
  selectElm.addEventListener('change', (elm) => {
    config.projectName(elm.target.value)
      .then(() => showMessage('saved'))
  })
})
