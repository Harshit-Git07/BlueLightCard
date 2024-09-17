# Storybook Documentation

Storybook docs are used for documenting the components and providing guidance on how to use our various React components across all of our UI packages.

## How do I write Storybook docs?

Each component needs an `.mdx` file which will contain the documentation, see the [storybook docs](https://storybook.js.org/docs/writing-docs/doc-blocks). For specific examples of how to write Storybook documentation, see: `packages/shared-ui/src/components/OfferCardList/OfferCardList.mdx` and `packages/shared-ui/src/components/PaginationControls/PaginationControls.mdx`.

## Custom Blocks

We have also created some of our own custom documentation block components for use in Storybook documentation. These are:

- `packages/shared-ui/.storybook/blocks/ComponentStatus` for showing information about the current development status of the component
- `packages/shared-ui/.storybook/blocks/FigmaEmbed` for showing the relevant Figma designs for the component

Feel free to add your own custom components in `packages/shared-ui/.storybook/blocks` if you think of more that could help others when writing docs.

### How do I use custom blocks in Web or Mobile Hybrid?

If you want to easily reference these Shared UI custom blocks in Web or Mobile Hybrid, it would be a good idea to add a new import alias in the `webpackFinal` property of the `.storybook/main.js` of your package.

```js
module.exports = {
  webpackFinal: async (config) => {
    config.resolve.alias = {
      '@bluelightcard/shared-ui/storybook-config': resolve(__dirname, '../../shared-ui/.storybook'),
    };
    return config;
  },
};
```

You can then import these blocks in your Web or Mobile Hybrid documentation like this:

```js
import ComponentStatus from '@bluelightcard/shared-ui/storybook-config/blocks/ComponentStatus';
import FigmaEmbed from '@bluelightcard/shared-ui/storybook-config/blocks/FigmaEmbed';
```
