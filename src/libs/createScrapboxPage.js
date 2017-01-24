import config from '../config'
import thenChrome from 'then-chrome'

export default async ({title, url, body}) => {
  const projectUrl = 'https://scrapbox.io/' + await config.projectName()
  thenChrome.tabs.create({
    url: projectUrl + '/' + encodeURIComponent(title) + '?body='
      + encodeURIComponent(`[${title} ${url}]\n${body}`)
  })
}
