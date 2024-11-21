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
