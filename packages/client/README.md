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
 - `lint:css` - Lints all the CSS/SCSS code.
 - `test` - Runs all unit tests.
 - `storybook` - Runs the storybook server.
 - `storybook:deploy` - Deploys all stories to chromatic.

### Alias paths
Currently there are the following alias paths setup for importing:
 - `@/components`
 - `@/pages`
 - `@/hooks`
 - `@/utils`

### Custom CSS variables
Coming soon...

### New Relic
To configure New Relic for distribution, set the following env vars
```
NEXT_PUBLIC_NEWRELIC_LICENSE_KEY
NEXT_PUBLIC_NEWRELIC_APPLICATION_ID
```

### Components
All components should be put in the components folder and consist of the following files for each component:
 - **[ComponentName]**.tsx - React component
 - **[ComponentName]**.stories.tsx - Storybook file
 - **types.ts** - Types for the component

So the structure will look like:
```
├── components
│   ├── [ComponentName]
│   │   ├── [ComponentName].tsx
│   │   ├── [ComponentName].stories.tsx
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