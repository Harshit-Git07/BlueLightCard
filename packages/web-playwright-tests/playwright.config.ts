import { PlaywrightTestConfig, devices } from '@playwright/test';
import { testConfig } from './testConfig';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables from the correct .env file
const ENV = process.env.npm_config_ENV || 'live';
const envFilePath = `.env.${ENV}`;

if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
  console.log(`Loaded environment variables from ${envFilePath}.`);
} else {
  console.error(`No environment file found for ${ENV} environment.`);
  process.exit(1);
}
console.log(`Using Playwright configuration - running selected test/s against ${ENV} environment.`);

const workers = 4;

const config: PlaywrightTestConfig = {
  // Global Setup to run before all tests
  globalSetup: './global-setup',

  // Sets timeout for each test case - i.e., the maximum length a test can run
  timeout: 120000,

  // Number of retries if test case fails
  retries: 0,

  // Reporters
  reporter: [
    ['./CustomReporterConfig.ts'],
    ['allure-playwright'],
    ['html', { outputFolder: 'html-report', open: 'never' }],
  ],

  // Number of parallel workers
  workers,

  projects: [
    // {
    //   name: "Chrome",
    //   use: {
    //     // Configure the browser to use.
    //     browserName: "chromium",

    //     // Chrome Browser Config
    //     channel: "chrome",

    //     // Base URL based on environment variable
    //     baseURL: process.env.BASE_URL,

    //     // Browser Mode
    //     headless: false,

    //     // Browser height and width
    //     viewport: { width: 1500, height: 730 },
    //     ignoreHTTPSErrors: true,

    //     // Enable File Downloads in Chrome
    //     acceptDownloads: true,

    //     // Artifacts
    //     screenshot: "only-on-failure",
    //     video: "retain-on-failure",
    //     trace: "retain-on-failure",

    //     // Slows down execution by ms
    //     launchOptions: {
    //       slowMo: 0,
    //       args: ["--disable-web-security"], // Disable web security
    //     },

    //     // Additional environment-specific settings
    //     extraHTTPHeaders: {
    //       Authorization: `Basic ${Buffer.from(
    //         `${process.env.USERNAME}:${process.env.PASSWORD}`
    //       ).toString("base64")}`,
    //     },

    //     // Bypass Content Security Policy
    //     bypassCSP: true,
    //   },
    // },

    // Uncomment and configure other projects as needed
    // {
    //   name: 'Chromium',
    //   use: {
    //     browserName: 'chromium',
    //     baseURL: process.env.BASE_URL,
    //     headless: false,
    //     viewport: { width: 1500, height: 730 },
    //     ignoreHTTPSErrors: true,
    //     acceptDownloads: true,
    //     screenshot: 'only-on-failure',
    //     video: 'retain-on-failure',
    //     trace: 'retain-on-failure',
    //     launchOptions: {
    //       slowMo: 0,
    //     },
    //   },
    // },

    // {
    //   name: `Chromium`,
    //   use: {
    //     browserName: `chromium`,
    //     baseURL: testConfig[ENV],
    //     headless: false,
    //     viewport: { width: 1500, height: 730 },
    //     ignoreHTTPSErrors: true,
    //     acceptDownloads: true,
    //     screenshot: `only-on-failure`,
    //     video: `retain-on-failure`,
    //     trace: `retain-on-failure`,
    //     launchOptions: {
    //       slowMo: 0
    //     }
    //   },
    // },

    // {
    //   name: `Firefox`,
    //   use: {
    //     browserName: `firefox`,
    //     baseURL: testConfig[ENV],
    //     headless: true,
    //     viewport: { width: 1500, height: 730 },
    //     ignoreHTTPSErrors: true,
    //     acceptDownloads: true,
    //     screenshot: `only-on-failure`,
    //     video: `retain-on-failure`,
    //     trace: `retain-on-failure`,
    //     launchOptions: {
    //       slowMo: 0,
    //     },
    //   },
    // },

    {
      name: `Edge`,
      use: {
        browserName: `chromium`,
        channel: `msedge`,
        baseURL: testConfig[ENV],
        headless: true,
        viewport: { width: 1500, height: 730 },
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        screenshot: `only-on-failure`,
        video: `retain-on-failure`,
        trace: `retain-on-failure`,
        launchOptions: {
          slowMo: 0,
        },
      },
    },

    // {
    //   name: 'Uk Tests',
    //   grep: /@Uk/,
    //   use: {
    //     browserName: 'chromium',
    //     baseURL: testConfig[ENV],
    //     headless: false,
    //     viewport: { width: 1500, height: 730 },
    //     ignoreHTTPSErrors: true,
    //     acceptDownloads: true,
    //     screenshot: 'only-on-failure',
    //     video: 'retain-on-failure',
    //     trace: 'retain-on-failure',
    //     launchOptions: {
    //       slowMo: 0,
    //     },
    //   },
    // },

    // {
    //   name: `WebKit`,
    //   use: {
    //     browserName: `webkit`,
    //     baseURL: testConfig[ENV],
    //     headless: true,
    //     viewport: { width: 1500, height: 730 },
    //     ignoreHTTPSErrors: true,
    //     acceptDownloads: true,
    //     screenshot: `only-on-failure`,
    //     video: `retain-on-failure`,
    //     trace: `retain-on-failure`,
    //     launchOptions: {
    //       slowMo: 0
    //     }
    //   },
    // },
    // {
    //   name: `Device`,
    //   use: {
    //     ...devices[`Pixel 4a (5G)`],
    //     browserName: `chromium`,
    //     channel: `chrome`,
    //     baseURL: testConfig[ENV],
    //     headless: true,
    //     ignoreHTTPSErrors: true,
    //     acceptDownloads: true,
    //     screenshot: `only-on-failure`,
    //     video: `retain-on-failure`,
    //     trace: `retain-on-failure`,
    //     launchOptions: {
    //       slowMo: 0
    //     }
    //   },
    // },
    // {
    //   name: `DB`
    // },
    // {
    //   name: `API`,
    //   use: {
    //     baseURL: testConfig[ENV]
    //   }
    // }
  ],
};

console.log(`Configured to use ${workers} parallel workers.`);

export default config;
