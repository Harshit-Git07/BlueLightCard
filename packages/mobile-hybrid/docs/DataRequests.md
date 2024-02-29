# Data Requests - Native App
All data requests are made from Mobile Hybrid through the Native application.

The interaction with the Native API occurs in the `InvokeNativeAPICall` class in `apiCall.ts`. This delegates to `facade.ts` which calls the relevant injected shimmed functions via the webkit message handlers and listeners.

## Making a data request
To make a data request you must use the `InvokeNativeAPICall` class.

1. Import the `InvokeNativeAPICall` class to the top of your file where API call will be triggered
    - i.e. `const request = new InvokeNativeAPICall();`.
2. Call the `requestData` method i.e. `request.requestData()` and include your parameters, these are:
    - url - url of the API request is being sent too i.e. `APIUrl.Search`. There is an enum located [here](../src/globals.ts) which stores the available API urls.
    - queryParams - query params object to be sent to the API url.

Example data request call:

```tsx
const request = new InvokeNativeAPICall();

const onRequest = (term: string) => {
  request.requestData(APIUrl.Search, { term }); 
};
```

_Note:_ Currently the `InvokeNativeAPICall` class only makes GET requests. This will be updated soon to be able to take POST requests for api calls which require the ability to POST.

## Testing a data request
The data request class can be component tested to ensure it is correctly called. This can be done by:

In the component test file for the specific component you can mock and spy on the `InvokeNativeAPICall` class to be able to check if the event has been sent through it.

```tsx
jest.mock('@/invoke/apiCall');

const requestMock = jest
  .spyOn(InvokeNativeAPICall.prototype, 'requestData')
  .mockImplementation(() => jest.fn());
```

You render your component within your test or in a separate function as normal. You can then assert on the mocked analytics function.

```tsx
it("should send data request", () => {
  render(<SearchResults />);

  expect(requestMock).toHaveBeenCalledWith({
    url: 'APIUrl.Search',
    queryParams: {
      term: 'Pizza'
    }
  });
});
```
