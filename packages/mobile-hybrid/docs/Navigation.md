# Hybrid Navigation

## Navigating within Mobile Hybrid
Navigating within the mobile hybrid app is performed as normal using the NextJS pages router. This uses:

```tsx
const router = useRouter();

router.push(`/categories?category=${categoryId}`);
```

## Navigating from Mobile Hybrid to Native
Navigating to a native app page from mobile hybrid is performed via navigation messages sent to the native app from mobile hybrid.  
As mentioned in [HybridArchitecture.md](HybridArchitecture.md), we use interfaces to define the communication layers. You can read more about how posting to the Native API works there.
The `Facade` class for navigation is located [here](../src/invoke/navigation.ts).

### How to navigate to a Native page from Mobile Hybrid
To navigate to a native page from the mobile hybrid app you perform the following steps:

1. Import the `InvokeNativeNavigation` class to the top of your file where navigation will be triggered 
   - i.e. `const navigation = new InvokeNativeNavigation();`.
2. Call the navigation method i.e. `navigation.navigate()` and include your parameters, these are:
   - URL - this will be the url of the native page & any additional url params i.e. `/offerdetails.php?cid=123&oid=456`
     - Links can be found [here](https://bluelightcard.atlassian.net/wiki/spaces/BTB/pages/2039152671/Deeplink+-+How+to+Braze+-+Examples+-+BLC+UK+and+DDS+and+BLC+Aus#Search) of link examples which would be used for navigating between hybrid mobile & native apps
   - Domain - this will be the location which the navigation requests occurs from on the mobile hybrid side. It is used by the native app to narrow down requests to originating from a particular webview. Examples are "home", "search". Align with other teams/mobile devs before implementing.

Example navigation call:

```tsx
const navigation = new InvokeNativeNavigation();

const onNavigate = (companyId: string, offerId: string) => {
  navigation.navigate(`/offerdetails.php?cid=${companyId}&oid=${offerId}`, 'search'); 
};
```

### Testing navigation to a Native page from Mobile Hybrid
#### Local testing:
There is a current solution in progress using `localhost` development.
Reach out to the Discovery team for assistance for the meantime.

#### Component testing:
To component test navigation you can:

In the component test file for the specific component you can mock and spy on the `InvokeNativeNavigation` class to be able to check if the event has been sent through it.

```tsx
jest.mock('@/invoke/navigation');

const navigationMock = jest
  .spyOn(InvokeNativeNavigation.prototype, 'navigate')
  .mockImplementation(() => jest.fn());
```

You render your component within your test or in a separate function as normal. You can then assert on the mocked analytics function.

```tsx
it("should send navigation event", () => {
  render(<SearchResults />);

  expect(navigationMock).toHaveBeenCalledWith({
    url: '/offerdetails.php?cid=123&oid=456',
    domain: 'search'
  });
});
```
