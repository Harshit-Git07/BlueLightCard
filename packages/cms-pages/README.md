# CMS Pages

This project contains the logged out landing pages. It integrates with Sanity as a headless CMS and builds static pages for:

- Homepage
- Brand landing pages

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Frontend

This is a demo front end designed to showcase the Bluelightcard Sanity content model.
The entities in the src/ui folder correspond to content model entities and are used to render the presentation of the semantic content in the model.

Queries that pull data from the Sanity content lake mainly live in queries.ts

## Sanity CDN Images in Storybook

When loading images using the `urlFor` utility or via the `Img` react component, the default base url used is the Sanity CDN (`https://cdn.sanity.io`), however when loading images in storybook both these tools have the base url set to the storybook instance.

The Sanity CDN image path format is: `/images/{sanity_project_id}/{sanity_dataset}/{asset_image_file_name}`

So the base urls are:

- If running in the nextjs app - `https://cdn.sanity.io/images`
- If deployed - `http://{storybook domain}.co.uk/images`
- If running locally - `http://localhost:6006/images`

To add an image for mocking in storybook, the images need to be put in the `storybook-assets` folder, then the structure follows the Sanity CDN path structure e.g `images/1/storybook/{image_file_name}`.
