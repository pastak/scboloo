# wemf
Format manifest.json to use on WebExtension from Chrome Extension

## Install

`% npm install -g wemf`

## Usage

```
  Usage: wemf <packageJsonPath> [options]

  Options:

    -h, --help          output usage information
    -V, --version       output the version number
    --validate          Only validate package.json
    -O --output <path>  Output package.json path
    -U --update         Update package.json itself
```

### Formatter

`% wemf /path/to/chrome-ext/package.json -O /path/to/firefox-ext/package.json`

### Validate

`% wemf /path/to/firefox-ext/package.json --validate`

if it has no problem, return nothing

## information

Please check newest information

- [WebExtensions - MozillaWiki](https://wiki.mozilla.org/WebExtensions)
- [Are we Web Extensions yet?](http://www.arewewebextensionsyet.com/)
- [Chrome incompatibilities - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Chrome_incompatibilities)
- [manifest.json - Mozilla | MDN](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json)

## Development

Welcome your Pull Request!!

Please fork it and send Pull Request to this repository.

### Testing

`% npm test`
