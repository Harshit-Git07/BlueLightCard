# BLC Chrome Extension

## Getting Started

To run the extension locally, follow these steps:

1. Build the chrome extension with `npm run build:develop -w packages/chrome-extension`
2. Go to `chrome://extensions/` in Chrome
3. If necessary, uninstall any existing instance of the BLC Chrome Extension
4. Click "Load Unpacked" and select the "dist" folder (`packages/chrome-extension/dist`)

Each time you make changes to the code, you will need to repeat this process.

## Release Process

When a PR is merged, a staging build of the extension is created in CI. A link to this is posted to [this Teams channel](https://teams.microsoft.com/l/channel/19%3Ab45dbdd9b4fa4464a1bb2e9e0cf35e42%40thread.tacv2/Chrome%20Extension%20Build%20Notifications?groupId=ca1df385-932e-49d1-9286-e02f6e93cde4&tenantId=c29b61cd-812d-4bdc-b826-570429dda66e).
A release PR will also be generated to update the changelog. Once we're ready to release the extension to production, this
release PR should be merged, which will trigger a new release build of the extension to be created and posted to the
same channel. A product manager will need to download the release build and manually upload it to the Chrome store.

## Technical Details

### Google Search Result 

We manage the processing of Google search results inside the content script.

**Path:** `packages/chrome-extension/src/contentScript/contentScript.js`

### Observer

We utilize MutationObserver to monitor changes in the DOM, and then we transmit the data to the background script.

We monitor the following CSS classes and tags on the Google search result page.

```javascript
const searchResults = target.querySelectorAll('.MjjYud'); // search result
const sponsors = target.querySelectorAll('.qGXjvb'); // sponsored result

let urlElement: HTMLElement | null = node.querySelector('cite'); // cite tag for searchResults url
urlElement = node.querySelector('.x2VHCd'); // for sponsored result
```

Afterward, we attach the observer to the body of the Google page:

```javascript
if (window.location.href.includes('google')) {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
```

### Uglifying the production code

We use the `terser-webpack-plugin` package to uglify the production code.

```javascript
const TerserPlugin = require('terser-webpack-plugin');
optimization: {
  minimize: true,
  minimizer
  [
    new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true,
        },
        format: {
          comments: false,
        },
      },
      extractComments: false,
    })
  ]
}
```
