# Hybrid Analytics

## Overview
This documentation details how analytic events (i.e Amplitude events) are sent from the mobile hybrid app to Amplitude via the Native App. The reason analytics are sent via the Native app is that it makes use of the logged in user session in the mobile app.

As mentioned in [HybridArchitecture.md](HybridArchitecture.md), we use interfaces to define the communication layers. You can read more about how posting to the Native API works there.

The `Facade` class for analytics is located [here](../src/invoke/analytics.ts).

## How to record an Analytic Event

To use the invoke class and send analytics data to native, you would do something like below:
- Import the `InvokeNativeAnalytics` class to the top of your file where the event will be recorded i.e. `const analytics = new InvokeNativeAnalytics();`.
- Call the method name `logAnalyticsEvents` of that class `analytics.logAnalyticsEvent({...params})`.
- Enter your `event` name param (this will be the event name recorded in Amplitude exactly).
- Enter any additional parameters.

*Note*: Your event name must be added to the enum `AmplitudeEvents` located [here](../src/utils/amplitude/amplitudeEvents.ts). This ensures that all analytics events remain consistent and are easy to amend in a central location.

Example component making an analytic call:

```tsx
// create an instance of InvokeNativeAnalytics
import { AmplitudeEvents } from 'mobile-hybrid/src/utils/amplitude/amplitudeEvents'

const analytics = new InvokeNativeAnalytics();

const Home: NextPage<any> = () => {
  useEffect(() => {
    // call its function to send analytics data to native
    analytics.logAnalyticsEvent({
      event: AmplitudeEvents.HOMEPAGE_VIEWED,
      parameters: {
        'scroll_depth_(%)': depth,
      },
    });
  }, []);
  return (
    <main>
      ...
    </main>
  );
};
```

## How to component test an Analytic Event

Once an analytic event is added to a component it can be tested via component testing.

In the component test file for the specific component you can mock and spy on the `InvokeNativeAnalytics` class to be able to check if the event has been sent through it.

```tsx
jest.mock('@/invoke/analytics');

const analyticsMock = jest
  .spyOn(InvokeNativeAnalytics.prototype, 'logAnalyticsEvent')
  .mockImplementation(() => jest.fn());
```

You render your component within your test or in a separate function as normal. You can then assert on the mocked analytics function.

```tsx
it("should log analytics event", () => {
  render(<SearchResults />);

  expect(analyticsMock).toHaveBeenCalledWith({
    event: AmplitudeEvents.SEARCH_RESULTS_LIST_VIEWED,
    parameters: {
      search_term: searchTermValue,
      number_of_results: 2,
    },
  });
});
```

## Viewing your Analytic Event in Amplitude

To test that you have recorded an event successfully you can see the events coming through in Amplitude.

You will need your `mobile-hybrid` local instance running via `npm run dev` and a native application (iOS or Android) running locally to be able to process the events successfully through to Amplitude.

Once you have your local native application running locally and perform the action which triggers the event then it should push the events to the Amplitude "Development" project.

In Amplitude:
- Check "Users & Sessions" tab
- Ensure the project dropdown says "Blue Light Card - Development"
- Search by your User ID to find a trail of your events being produced
