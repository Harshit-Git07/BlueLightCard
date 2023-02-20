This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


### Dependencies

- react
- [nextjs](https://nextjs.org/docs)
- react-bootstrap
- bootstrap
- [i18next](https://www.i18next.com/)
- [next-i18next](https://github.com/i18next/next-i18next)
- [react-i18next](https://github.com/i18next/react-i18next)
- [storybook](https://storybook.js.org/)
- sass
- jotai
- react-hook-forms
- yup (form validation)
- jest
- testing-library
- styled-components
- dayjs
- lodash
- fortawesome
- @stripe/stripe-js
- @stripe/react-stripe-js

### Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Scripts

 - `build` - Builds a distribution of the app.
 - `lint` - Lints all the code.
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

### Brand targeting
There are 3 environment variables available to build targeted distributions i.e build a dist for blc brand in the australia region.

 - `NEXT_APP_BRAND` - defaults to 'fallback'
 - `NEXT_APP_REGION` - defaults to 'GB'
 - `NEXT_APP_LANG` - defaults to 'en'

The command for building a targeted distribution for the blc brand in the australia region

```
NEXT_APP_BRAND=blc NEXT_APP_REGION=AU npm run build
```

If none of the environment variables are set, then the defaults are used.

To run the app locally for a specific brand, you can do similar to the above but just swap `build` with `dev`

```
NEXT_APP_BRAND=blc NEXT_APP_REGION=AU npm run dev
```

**TODO**: Handle the scenario when a brand, region or lang provided doesn't exist.