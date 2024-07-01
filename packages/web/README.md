# BlueLightCard Client

Package for the web client

### Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Scripts

- `build` - Builds a distribution of the app.
- `lint` - Lints all the code.
- `lint:css` - Lints all the CSS code.
- `test` - Runs all unit tests.
- `storybook` - Runs the storybook server.
- `storybook:deploy` - Deploys all stories to chromatic.

### Alias paths

Currently there are the following alias paths setup for importing:

- `@/components`
- `@/pages`
- `@/hooks`
- `@/utils`

### Datadog

We use Datadog to report on user metrics and client errors. The following environment variables are used to help configure the Datadog client.

```sh
NEXT_PUBLIC_DATADOG_APP_ID
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN
NEXT_PUBLIC_DATADOG_DEFAULT_SERVICE
NEXT_PUBLIC_DATADOG_SITE (default='datadoghq.eu')
NEXT_PUBLIC_DATADOG_ENV
```

### Components

All components should be put in the components folder and consist of the following files for each component:

- **[ComponentName]**.tsx - React component
- **[ComponentName]**.stories.tsx - Storybook file
- **Docs.md** - Document component in storybook
- **types.ts** - Types for the component

### Bundle Analyser

To analyse the overall bundle size and it's chunks, developers can use the bundle analysis tool to inspect chunk sizes and see how dependencies contribute to the size of these chunks.

It's important to keep the overall size of the bundle small as possible to reduce load times for end users, thats also why we gzip the content for smaller network transfers.

```sh
# build bundle
npm run build

# run analyser on local server i.e http://127.0.0.1:8888
npm run bundle-analyser
```

So the structure will look like:

```
├── components
│   ├── [ComponentName]
│   │   ├── [ComponentName].tsx
│   │   ├── [ComponentName].stories.tsx
│   │   ├── Docs.md
│   │   ├── types.ts
```

### Storybook

We use storybook as our frontend workshop tool, to help build and manually test the white-label components in isolation.

Each component should have a corresponding story written for it i.e `[ComponentName].stories.tsx`

Stories are deployed to [chromatic](https://www.chromatic.com/) which allows us to iterate and get visual feedback on the components.

Read more on [Storybook](https://storybook.js.org/) and the [docs](https://storybook.js.org/docs/react/why-storybook)

### Brand targeting and internationalising

There are 3 environment variables available to build targeted distributions i.e build a dist for a brand in the australia region.

- `NEXT_PUBLIC_APP_BRAND` - defaults to 'default'
- `NEXT_PUBLIC_APP_REGION` - defaults to 'GB'
- `NEXT_PUBLIC_APP_LANG` - defaults to 'en'

To run a build or run the dev server using the above env vars

```
NEXT_PUBLIC_APP_BRAND=blc npm run dev
NEXT_PUBLIC_APP_BRAND=blc NEXT_PUBLIC_APP_REGION=GB npm run dev
```

### End to End tests

1. Preconditions tools to be added:

- Nodejs
- Playwright
- Cucumber
- Typescript

2. Install all necessary packages using npm: Run command to get all necessary packages:
   npm install

3. File structure:
   e2e -> Contains all the features & Typescript code
   test-results -> Contains all the reports related file
   e2e\features -> write your features here
   e2e\steps -> Your step definitions goes here
   e2e\support\world.ts -> Browser setup and teardown logic
   cucumber.json -> cucumber configuration
   package.json -> Contains all the dependencies

4. Cucumber structure:

a. QA/Product to write in feature folders. Tests are to be written in Gherkin format.
e.g.
Feature: name of feature
Background: background
Scenario: the test
Given I am on x page
When I click on login button
Then I should be on login page

b. Developer/QA to step definitions in steps/ folder. Given structure will be provided with running feature file. Tests are to be written in typescript
e.g.
Given('I am on {string} page', async function (string) {
// Write code here that turns the phrase above into concrete actions
return 'pending';
});

c. World hooks contain

6. Run tests by following command:

- npm run test:e2e OR npm run test:e2e -w packages/web

**NOTE**

Ensure that you have created a `.env` in the `packages/web/e2e` folder based on the `.env.example`

For further information please see https://bluelightcard.atlassian.net/wiki/spaces/BTB/pages/2095611905/Guide+for+Playwright+and+Cucumber
