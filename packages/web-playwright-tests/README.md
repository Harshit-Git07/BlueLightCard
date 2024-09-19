# Playwright TypeScript Test Framework

## Installation

### Navigate to the project folder and install npm packages:

```sh
cd packages/web-playwright-tests
npm ci
```

### For first-time installation, download the required browsers:

```sh
npx playwright install
```

## Usage

### Browser Configuration

Modify the required parameters in `playwright.config.ts` to configure the browser settings.

### Running Tests

#### Execute Entire Test Suite on All Browsers

To run the entire test suite on all available browsers, use the following command where `ENV` can be `staging` or `production`. Test cases are located in the `tests` folder:

```sh
npm run test --ENV="staging"
```

#### Execute a Single Test Case

To run a single test case use:

```sh
npm run test:single --ENV="staging"
```

To change the browser (e.g., Firefox), modify the `--project` parameter in `package.json` to match the browser name given in `playwright.config.ts`.

#### Execute Test Cases in Parallel

Add the tag `@SmokeTest` at the start of your test case name. Then, in `package.json`, set the tag value for `test:parallel` and execute:

```sh
npm run test:parallel --ENV="staging"
```

#### Execute Test Cases in Sequence

Add the tag `@SmokeTest` at the start of your test case name. Then, in `package.json`, set the tag value for `test:serial` and execute. The `--workers` parameter corresponds to the number of test cases you want to execute simultaneously (e.g., `--workers=3` executes 3 test cases simultaneously):

```sh
npm run test:serial --ENV="staging"
```

### Generate HTML Report

To generate an HTML report, which is a single static HTML file (`index.html`) that can be sent via email, use:

```npx playwright show-report html-report

```

## Debugging

For debugging test cases, add breakpoints and press `CTRL+SHIFT+P`, then type `debug:debug npm script`. In the edit box, select the desired script.

## Output Files

Screenshots, videos, and trace files will be generated in the `test-results` folder.

## Viewing Trace Files

To view trace files, navigate to the folder where `trace.zip` is generated and execute:

```sh
npx playwright show-trace trace.zip
```

## Custom Logging

Change the logging message at the test case/test step level in `CustomReporterConfig.ts`.

## Shorten Import Paths

In `tsconfig.json`, you can re-assign long path imports to a variable starting with `@` to shorten your import statements. For example, replace:

```json
"../../pageFactory/"
```

with:

```json
"@pages/_":["pageFactory/_"]
```

This will allow you to use `@pages` instead of the long import path in your files.
