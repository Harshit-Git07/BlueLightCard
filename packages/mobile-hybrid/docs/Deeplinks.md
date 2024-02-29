# Deeplinks
In order to support navigating users to a mobile hybrid page from a deeplink, there are a few components used to map deeplink URLs.

## Search Deeplinks
We currently support links that direct the user into the following search related pages

- `/searchresults`
- `/types`
- `/categories`

When a deeplink does not match any of the supported links above, it is defaulted to `/search`.

## Routing Flow

### Mobile Routing

The original link into the mobile apps looks like this:

`https://www.bluelightcard.co.uk/offers.php?type=1&opensearch=1&search=sport`.

This is then mapped to the URL below within the Android and iOS apps with the destination wrapped up in a URI 
encoded query parameter called `deeplink`:

`https://mobile-hybrid.pages.dev/search?deeplink=%2Foffers.php%3Fsearch%3Dsport%26type%3D1%26opensearch%3D1`

### Hybrid Routing
These mapped deeplinks will then be picked up by the NextJS page router via the path `/search` which is the search page 
located in `src/pages/search.tsx`. As part of this component there is a custom React hook called `useDeeplinkRedirect` 
which has the responsibility for identifying the target page.

Once it has identified the target it uses the router to redirect and appends the original query params.

So 
```
/offers.php?type=1&opensearch=1&search=sport

becomes...

/searchresults?type=1&opensearch=1&search=sport
```
## Testing
The logic for this redirection is tested in the `search.test.tsx` test suite via a mocked NextRouter component.
