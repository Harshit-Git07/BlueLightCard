import { PlaywrightTestConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Determine the environment and corresponding .env file
const ENV = process.env.npm_config_ENV || 'production';
const envFilePath = `.env.${ENV}`;

if (fs.existsSync(envFilePath)) {
  // Load environment variables from the .env file for local development
  dotenv.config({ path: envFilePath });
  console.log(`Loaded environment variables from ${envFilePath}.`);
} else {
  // If the .env file is not found, use environment variables from GitHub Secrets
  console.warn(
    `No environment file found for ${ENV} environment. Falling back to environment variables.`,
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
    ['allure-playwright'],
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
