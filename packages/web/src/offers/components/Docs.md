```js
import OfferCard from '../offers/components/OfferCard';
```

Used for displaying offer cards that will be used on the homepage and offers page. These will include an image, offer
name and company name. All fields for this component is required and consist of:
> imageSrc, alt, offerName, companyName, offerLink

## Image

The image can be set on the component using the `imageSrc` prop. This is a required field and must be supplied as all
offers should have an image.

> **Note** Image will fill the top division of the offer card which is responsive possible.

## Sample

A sample of this component being used is as follows:

```tsx
<OfferCard
  imageSrc="https://cdn.bluelightcard.co.uk/offerimages/1689584711960.jpg"
  alt="Forest Holidays"
  offerName="20% off OLED TVs"
  companyName="LG"
  offerLink="https://www.bluelightcard.co.uk/offerdetails.php"
/>
```

## Design Tokens

List of tokens that are used to style the component.

| Type       | Token                          | Description                                   |
|------------|--------------------------------|-----------------------------------------------|
| Background | `color.surface.secondary.dark` | Dark mode of the background of the offer card |
| Fonts      | `fonts-["MuseoSans"]`          | The font used for the text                    |
|
