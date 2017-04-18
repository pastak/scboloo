# scboloo
easy way to post webpage to scrapbox.io

![DEMO](docs/demo.gif)

## Install

### For users

You can download extension packages from https://github.com/pastak/scboloo/releases

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
  - `% yarn run build`
    - dir: `dist/chrome`, `dist/firefox`, 'dist/msedge'
    - watch: `% yarn run watch`
