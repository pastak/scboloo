export default (url, title) => {
  const tags = []

  console.log('URL=' + url)
  console.log('title=' + title)

  if (typeof title !== undefined) {
    if (title.match(/ボランティア/)) tags.push('#ボランティア')
    if (title.match(/募集/)) tags.push('#募集中')
    if (title.match(/義援金/)) tags.push('#義援金')
    if (title.match(/寄付金/)) tags.push('#寄付金')
    if (title.match(/支援金/)) tags.push('#支援金')
    if (title.match(/申請/)) tags.push('#被災手続き')
    if (title.match(/復興支援/)) tags.push('#復興支援')
  }

  if (typeof url !== undefined) {
    if (url.match(/shakyo/) || url.match(/ehimesvc/)) tags.push("#ボランティア")
    if (url.match(/uwajima/)) tags.push('#宇和島市')
    if (url.match(/seiyo/)) tags.push('#西予市')
    if (url.match(/ozu/)) tags.push('#大洲市')
    if (url.match(/matsuyama/)) tags.push('#松山市')
    if (url.match(/imabari/)) tags.push('#今治市')
    if (url.match(/matsuno/)) tags.push('#松野町')
    if (url.match(/kihoku/)) tags.push('#鬼北町')
    if (url.match(/kamijima/)) tags.push('#上島町')
    if (url.match(/ainan/)) tags.push('#愛南町')
    if (url.match(/pref\.ehime/)) tags.push('#愛媛県')
  }
  console.log('tags in method=' + tags.toString())
  return tags
}
