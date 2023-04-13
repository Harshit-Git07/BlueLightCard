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

 - `NEXT_APP_BRAND` - defaults to 'default'
 - `NEXT_APP_REGION` - defaults to 'GB'
 - `NEXT_APP_LANG` - defaults to 'en'

The command for building a targeted distribution for a brand in the australia region

```
NEXT_APP_BRAND=[brand name] NEXT_APP_REGION=AU npm run build
```

If none of the environment variables are set, then the defaults are used.

To run the app locally for a specific brand, you can do similar to the above but just swap `build` with `dev`

```
NEXT_APP_BRAND=[brand name] NEXT_APP_REGION=AU npm run dev
```
The above environment variables also affect what language translation is used, as each brand has a set locales in them, so for example running the above build command will use the following translation
```
[brand name]/locales/en-AU
```
If the AU language translation is not available, then the fallback language which is english `en` will be used instead.
```
[brand name]/locales/en
```

**TODO**: Handle the scenario when a brand, region or lang provided doesn't exist.