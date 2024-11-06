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
    console.warn(`No environment file found for ${ENV} environment. Falling back to environment variables.`);
}

console.log(`Using Playwright configuration - running selected tests against ${ENV} environment.`);

const config: PlaywrightTestConfig = {
    // Global setup before all tests
    globalSetup: './global-setup',

    // Timeout settings for individual tests
    timeout: 120000,

    // Number of retries for failed tests
    retries: 0,

    // Reporting configurations
    reporter: [
        ['./CustomReporterConfig.ts'],
        ['allure-playwright'],
        ['html', { outputFolder: 'html-report', open: 'never' }],
    ],

    // Parallel worker settings
    workers: 4,

    // Browser-specific configurations as separate projects
    projects: [
        {
            name: 'Firefox',
            use: {
                browserName: 'firefox',
                headless: true,
                viewport: { width: 1280, height: 720 },
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                screenshot: 'only-on-failure',
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
            },
        },
        {
            name: 'Chrome',
            use: {
                browserName: 'chromium',
                headless: true,
                viewport: { width: 1280, height: 720 },
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                screenshot: 'only-on-failure',
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
            },
        },
        {
            name: 'Microsoft Edge',
            use: {
                browserName: 'chromium', // Edge is based on Chromium
                channel: 'msedge', // Use the Microsoft Edge channel
                headless: true,
                viewport: { width: 1280, height: 720 },
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                screenshot: 'only-on-failure',
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
            },
        },
        {
            name: 'Safari',
            use: {
                browserName: 'webkit', // WebKit is used for Safari
                headless: true,
                viewport: { width: 1280, height: 720 },
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                screenshot: 'only-on-failure',
                video: 'retain-on-failure',
                trace: 'retain-on-failure',
            },
        },
    ],
};

console.log(`Configured to use ${config.workers} parallel workers.`);

export default config;
