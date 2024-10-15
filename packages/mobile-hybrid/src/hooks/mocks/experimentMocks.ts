type ExperimentMock = {
  [key: string]: string;
};

const experimentMocks: ExperimentMock = {
  'v5-api-integration': 'on',
  'offer-sheet-redeem-preapplied-app': 'treatment',
  'offer-sheet-redeem-non-vault-app': 'treatment',
  'offer-sheet-redeem-vault-app': 'treatment',
};

export default experimentMocks;
