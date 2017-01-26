# scboloo
easy way to post webpage to scrapbox.io

![DEMO](docs/demo.gif)

## Install

### For users

TBD

### For developers

Plase read how to build on below.

## Build Packages

### Setup

- Install `node` and `yarn`
- `% yarn install`
- `% yarn build`

### Make Packaging

- All packages(for Chrome, Firefox, MSEdge): `% yarn run pack`
- Chrome: `% yarn run pack:chrome`
- Firefox: `% yarn run pack:firefox`
  - This command will try to pack for Firefox v52 and if it fails then pack for version less than v52
  - Your target version is less than v52: `% yarn run pack:firefox:v50`
    - Why Firefox v52? - Firefox v52 has native support for `await-async`
- MS Edge: `% yarn run pack:msedge`
  - If you install your MS Edge you should sign appX

### Built Package Location

- Chrome(crx): `packages/scboloo.crx`
- Chrome(zip): `packages/scboloo.chrome.zip`
- Firefox: `packcages/scboloo-X.X.X.zip`
- MSEdge: `packages/edgeExtension.appx`

## Development

- Require `node`, `yarn`

1. `% git clone git@github.com:pastak/scboloo.git`
2. `% cd scboloo`
3. `% yarn install`
4. Run build command
  - Chrome, Firefox(> v52): `% yarn run build`
    - dir: `dist/chrome`, `dist/firefox`
    - watch: `% yarn run watch`
  - Firefox (< v52): `% yarn run build:firefox:v50`
    - dir: `dist/firefox-v50`
    - watch: `% yarn run build:firefox:v50 -- --watch`
  - MSEdge: `% yarn run build:msedge`
    - dir: `dist/msedge`
    - watch: `yarn run build:msedge -- --watch`
