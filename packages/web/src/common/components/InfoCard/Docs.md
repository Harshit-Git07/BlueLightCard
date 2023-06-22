```js
import InfoCard from '@/components/InfoCard/InfoCard';
```
Used for displaying information such as title, text and image.

## Image
The image can be set on the component using the `src` prop. By default the image will be aligned to the top and fully responsive based on the component size. Fixed image width and height can be set on the card, but be aware that this will mean the image won't scale to match the card width responsively.

> **Note** Image should be responsive where possible, to match the responsiveness of the card.

```tsx
<InfoCard imageSrc='' imageWidth={400} imageHeight={300} />
```

## Interaction
Interaction can be applied to the component, to allow a user to click on the card which actions a task. To enable this feature, you need to provide the `onClick` callback handler.

Selected state can also be applied to the component.

```tsx
<InfoCard selected={true} onClick={() => {}} />
```

## Layout
Image positioning can change by setting the `layout` prop. This means you can position the image to the left for example and display the card in a list item.

> Layout defaults to `InfoCardLayout.ImageTop` which positions the image across the top of the card.

```tsx
<InfoCard layout={InfoCardLayout.ImageLeft} {...props} />
```

## Design Tokens
List of tokens that are used to style the component.

| Type | Token | Description |
| ----- | ----- | ----------- |
| Border | `color.border.card.base` | Light mode of the card border color |
| Border | `color.border.card.dark` | Dark mode of the card border color |
| Border | `color.border.card.selected.base` | Light mode of the selected card border color |
| Border | `color.border.card.selected.dark` | Dark mode of the selected card border color |
