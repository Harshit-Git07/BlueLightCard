```ts
import Footer from '@/components/Footer/Footer';
```
Used to display a footer with an optional section intended to be used for the login element.

### Navigation Items
`navigationLinks` is the entry point for the sections of links. One title and many links are given. 
There is no cap on this, but more than 4 sections gets uncomfortable (3 when there is a login form attached). The same is true for the links in each section, there is no cap but too many links get's uncomfortable.

### Login Form
Login form can be added as a HTML element or other component via the `loginForm` prop, instead of passing it along as a child, you can provide it to the loginForm prop. It is provided as a prop as it is just a small box in the component rather than the component being made up of it's children.
Anything added to the loginForm section be added to the left of the sections (or shown at the top on mobile).
It does not need to be a login form, but to add a login form is the intention for this prop.

### Social Icons and Downloads
Social media icons can be added with the `socialLinks` props, with the data in the same shape of component SocialIcons. Currently only "twitter", "facebook" and "instagram" are supported, but these use FontAwesome so can be easily updated.

Download links (links to google play and the apple app store) are done using the `downloadLinks` prop and is provided as a list of objects with the shape:

```ts
{
  "imageUrl": string, // Image URL, from cdn.bluelightcard.co.uk
  "downloadUrl": string, // Link to the app store
  "linkTitle": string // Text displayed on hover
},
```

### Copyright text
The `copyrightText` prop is a string which is shown at the bottom of the footer. If it is not given, this section will not show.

## Design Tokens
List of tokens that are used to style the component. This is to be changed once colour's have been decided for this section. For now it just mimics the legacy site.

| Type | Token | Description |
| ----- | ----- | ----------- |
| Background | `palette.primary.base` | The footers main section background color |
| Background | `palette.tertiary.base` | The footers social/downloads section background color |
| Background | `shade.dukeblue.800` | The footers copyright section background color |