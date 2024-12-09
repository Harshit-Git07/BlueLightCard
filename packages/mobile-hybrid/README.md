## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```


Hybrid is built as a React frontend for the iOS and Android apps, so by default it will only actually work inside of the app environments. This means that when the development server is running you will also need to set up the native app development environments. Currently, the best existing documentation for this can be found here:

- [iOS](https://bluelightcard.atlassian.net/wiki/spaces/BTB/pages/2522513443/Developer+Onboarding+iOS)
- [Android](https://bluelightcard.atlassian.net/wiki/spaces/BTB/pages/2435842373/Developer+onboarding+ANDROID)

Once your app environment is running, you should then be able to see Mobile Hybrid running in your app, all changes made should then be automatically applied even inside the app.

## Running hybrid in the browser

It is possible to run Hybrid in the browser with mocking so that it is not dependent on having an app environment also running. This can be enabled by adding the following to your `.env` file:

```
NEXT_PUBLIC_USE_NATIVE_MOCK=true
```

This behaviour is opt-in so the mocks will only be applied if the environment variable is explicitly set to true. All of the mocking logic used can be found and updated in `src/hooks/mocks`. It is worth noting that development should not be done solely using these mocks. They are a useful tool for enabling easier testing, but it is still also crucial to test against real data. **Never enable mocking in staging or production builds**.

## Running hybrid in PR ephemeral environments

Hybrid can be ran in the PR ephemeral environments as per usual by adding the `ready-for-test` label to your PR. Once the workflows have ran successfully, comments will be added to your PR telling you where to find your deployment. This works by using the mocking explained above to allow Hybrid to run in a browser. Therefore, the same disclaimer applies that this is still only mock data and you should also still test against real data once merged into staging.

## Testing

Hybrid has automated tests using Jest and React Testing Library that behave similar to most modern React testing suites. These can be ran with:

`npm run test -w packages/mobile-hybrid`

It is worth noting however that test coverage is not perfect and automated tests do not mean you should not also be manually testing changes. Especially for Hybrid it is crucial to test your changes in both the iOS and Android apps as there can be a lot of different behaviour to account for and the apps often don't work in quite the way you might expect.

A more detailed explanation of some of the caveats of Mobile Hybrid can be found in the [Hybrid Web UI Cost-Benefit Analysis](https://bluelightcard.atlassian.net/wiki/x/HYAyrw).

## UX Documentation

See `docs/StorybookDocumentation.md`.
