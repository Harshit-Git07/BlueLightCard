# App Lifecycle Events
In order for the mobile hybrid components to be aware of native app lifecycle events, there are hooks available to track lifecycle events broadcast to the `APP_LIFECYCLE` channel. These are located [here](../src/hooks/useAppLifecycle.ts).

_Note:_ This is only supported for Android currently as only Android is posting to the `APP_LIFECYCLE` channel.

Currently, there is a single `useOnResume` hook which handles `onResume` lifecycle events.


## Adding app resume lifecycle to component
To add the app resume lifecycle to a component you can do the following:

1. Bring in the `useOnResume()` hook to the component.
2. Include in the params of `useOnResume()` the callback which requires calling everytime `onResume` is consumed by the mobile hybrid app
