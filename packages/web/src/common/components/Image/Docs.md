```js
import Image from '@/components/Image/Image';
```
Extends the [Image](https://nextjs.org/docs/pages/api-reference/components/image) component, with loading placeholder feature always on.

## Loading State
Leverages next.js placeholder loading state while image loads, so that the user does not just see a blank box.
Because this extends the [Image](https://nextjs.org/docs/pages/api-reference/components/image) component, you can hook into the callbacks it exposes such as the loading callback.

## Responsiveness
By default the image is set to be responsive, this is so the image can scale according to the parent size.

> **Note** Set responsive to false if providing width and height.
