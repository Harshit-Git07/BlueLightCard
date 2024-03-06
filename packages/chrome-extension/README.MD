
# Google Search Result 

We manage the processing of Google search results inside the content script.

**Path:** `packages/chrome-extension/src/contentScript/contentScript.js`

## Observer

We utilize MutationObserver to monitor changes in the DOM, and then we transmit the data to the background script.

We monitor the following CSS classes and tags on the Google search result page:

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

# Uglifying the production code

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
