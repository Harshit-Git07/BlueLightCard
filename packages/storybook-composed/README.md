# Storybook Composed

## What is it?

Storybook is a tool we use in our frontend development workflow that allows us to test UI components in an isolated sandbox. This encourages rapid development and iteration of decoupled reusable components and provides a place for anyone to easily see and test all of the components that we have at our disposal.

[Storybook Composition](https://storybook.js.org/docs/sharing/storybook-composition) is a specific feature provided by Storybook that allows a Storybook configuration to be created that references other Storybook instances. This has allowed us to create one “centralised” Storybook that shows all of the deployed components in production for Web, Mobile Hybrid, and Shared UI, with branded versions included too.

This means that instead of needing to know 9 URLs for all of the different Storybook instances for these, now you only need to know 1.

## Where can I find it?

You can run this package locally with `npm run storybook -w packages/storybook-composed`.

You can also view the production build [here](https://bfcfa662.web-storybook-d1x.pages.dev/).

## What about local development?

Storybook Composed can be ran locally with the following command: `npm run dev -w packages/storybook-composed`.

This uses multithreading to run 9 separate Storybook builds in their own threads for Web, Mobile Hybrid, and Shared UI with variants for BLC UK, AU, and DDS. Once the builds have finished running, the Composed instance should be available at [`http://localhost:6006`](http://localhost:6006) and should hot reload when any changes are made as per usual.

## What about PR environments?

PR environments are currently unsupported. It is intended that this is something we will later be able to add support for. To review frontend changes in Storybook for a PR, you still need to look at the Storybook instance(s) for that PR individually.

## What is planned for this?

There is a rough “wishlist” of things we would like to do to improve on how we are using Storybook Composition. Nobody explicitly owns any of this work, so these are all available for anyone to do as and when if they wish to do so:

- Support PR environments
- Add light/dark mode support
- Fix the flash of the previous component that is visible when switching brands
