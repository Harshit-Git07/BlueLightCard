```ts
import Footer from '@/components/Footer/Footer';
```

Used to display a footer with with navigational links with an optional text block.

### Navigation Items

`navigationLinks` is the entry point for the sections of links. One title and many links are given.
There is no cap on this, but more than 4 sections gets uncomfortable (3 when there is a text block). The same is true for the links in each section, there is no cap but too many links get's uncomfortable(the content is managed from config files).

### Text Block

`textBlock` is an optional prop that can be used to add a `string` of text.

### Social Icons and Downloads

Social media icons can be added with the `socialLinks` prop, with the data in the same shape of component SocialMediaIcons. The icons are from FontAwesome so can be easily updated.

Download links (links to google play and the apple app store) are done using the `googlePlayStoreLink` and `appleStoreLink` props and is configured as a `string` of the url.

### Copyright text

The `copyrightText` prop is a string which is shown at the bottom of the footer.

## Design Tokens

The design tokens used in this component are from `Footer.json` in the `shared-ui` package, that consists of colour(light and dark) and typography tokens. See the example below:

| Type       | Token                                               | Description                   |
| ---------- | --------------------------------------------------- | ----------------------------- |
| Background | `bg-footer-bg-colour dark:bg-footer-bg-colour-dark` | The footers' background color |
