module.exports = {
  default: {
    tags: process.env.npm_config_tags || '',
    formatOptions: {
      snippetInterface: 'async-await',
    },
    paths: ['e2e/features/**/*.feature'],
    publishQuiet: true,
    dryRun: false,
    require: ['e2e/steps/*.ts', 'e2e/support/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:e2e/test-results/cucumber-report.html',
      'json:e2e/test-results/cucumber-report.json',
    ],
  },
};
