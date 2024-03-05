# React Hooks

## Overview
Mobile hybrid contains some useful react hooks, this document lists the most useful hooks.

## useAPI
Once a data request has been initiated using the data request class, you will need to receive and consume that response.

Signature - `useAPI<R>(apiUrl: string): R`
 - `apiUrl` - The original url that the request was made with, this is how you get the response for the appropriate request.

### Usage
Basic example of consuming an api response.
```tsx
interface DataResponse {
  data: {
    name: string;
  };
}
const Component: FC = () => {
  const { response } = useAPI<DataResponse>(APIUrl.Search);
  return (
    <div>{response.data.name}</div>
  );
};
```

## useAppLifecycle
Docs for this hook available [here](./AppLifecycleEvents.md)

## useDebounce
This hook helps with debouncing functions. For example when a user types into a search input, debouncing can be used to help throttle api requests.

Signature - `useDebounce(fn: () => void, wait: number): () => void`
 - `fn` - The function to debounce
 - `wait` - Interval in milliseconds for debouncing

### Usage
Basic example on debouncing data requests, on text input change.
```tsx
const Component: FC = () => {
  const throttle = useDebounce(() => {
    request.requestData(APIUrl.Search, {...});
  }, 500);

  return <input type="text" onChange={throttle} />;
};
```

## useDeeplinkRedirect
The hook handles deeplinks as documented [here](./Deeplinks.md).

Signature - `useDeeplinkRedirect(): void`

### Usage
```tsx
const Component: FC = () => {
  useDeeplinkRedirect();

  return <div></div>;
};
```