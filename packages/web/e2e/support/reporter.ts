import report from 'multiple-cucumber-html-reporter';

report.generate({
  jsonDir: 'e2e/test-results',
  reportPath: 'e2e/test-results',
  reportName: 'Automation Cucumber report',
  displayDuration: false,

  metadata: {
    browser: {
      name: 'chrome',
      version: '112',
    },
    device: 'Local test machine',
    platform: {
      name: 'ubuntu',
      version: '16.04',
    },
  },
  customData: {
    title: 'Test result information',
    data: [
      { label: 'Project', value: 'Custom project' },
      { label: 'Release', value: '1.2.3' },
      { label: 'Cycle', value: 'Smoke test' },
    ],
  },
});
