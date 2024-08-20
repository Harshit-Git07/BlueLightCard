import { PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Determine the environment from the system's environment variables
const ENV = process.env.ENV || 'production'; // Default to 'production' if ENV is not set

// Load environment variables from the correct .env file if it exists
const envFilePath = `.env.${ENV}`;
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
  console.log(`Loaded environment variables from ${envFilePath}.`);
} else {
  console.log(
    `No environment file found for ${ENV} environment. Using system environment variables.`,
  );
}

console.log(`Using Playwright configuration - running selected test/s against ${ENV} environment.`);

const workers = 4;

const config: PlaywrightTestConfig = {
  // Global Setup to run before all tests
  globalSetup: './global-setup',

  // Sets timeout for each test case - i.e., the maximum length a test can run
  timeout: 120000,

  // Number of retries if a test case fails
  retries: 0,

  // Reporters
  reporter: [
    ['./CustomReporterConfig.ts'],
    ['html', { outputFolder: 'html-report', open: 'never' }],
  ],

  // Number of parallel workers
  workers,

  projects: [
    {
      name: `Edge`,
      use: {
        browserName: `chromium`,
        channel: `msedge`,
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
  ],
};

console.log(`Configured to use ${workers} parallel workers.`);

export default config;
