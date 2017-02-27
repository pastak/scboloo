import thenChrome from 'then-chrome'

export default async ({title, body, projectName}) => {
  const projectUrl = 'https://scrapbox.io/' + projectName
  thenChrome.tabs.create({
    url: projectUrl + '/' + encodeURIComponent(title) + '?body=' + encodeURIComponent(body)
  })
}
