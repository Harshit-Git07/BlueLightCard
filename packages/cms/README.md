# BlueLightCard Admin Panel CMS

Package for the admin panel CMS

### Getting Started

Install dependencies

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

### Scripts

 - `build` - Builds a distribution of the app.
 - `lint` - Lints all the code.
 - `lint:css` - Lints all the CSS code.
 - `test` - Runs all unit tests.

### Alias paths
Currently there are the following alias paths setup for importing:
 - `@/components`
 - `@/pages`
 - `@/hooks`
 - `@/utils`

### New Relic
To configure New Relic for distribution, set the following env vars
```
NEXT_PUBLIC_NEWRELIC_LICENSE_KEY
NEXT_PUBLIC_NEWRELIC_APPLICATION_ID
```