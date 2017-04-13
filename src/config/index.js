import thenChrome from 'then-chrome'
const DEFAULT_HOST = 'https://scrapbox.io'
const ApiEndpoints = {
  getProjects: '/api/projects'
}

export default {
  get apiEndpoints () {
    return ApiEndpoints
  },
  get apiHost () {
    return DEFAULT_HOST
  },
  async projectName (name) {
    if (!name) return (await thenChrome.storage.sync.get('projectName')).projectName
    const _name = await thenChrome.storage.sync.set({projectName: name})
    return _name
  },
  getApiUrl (name) {
    return this.apiHost + this.apiEndpoints[name]
  }
}
