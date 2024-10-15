import legacyMocks from './legacyMocks';
import discoveryMocks from './discoveryMocks';
import identityMocks from './identityMocks';
import offersMocks from './offersMocks';
import redemptionsMocks from './redemptionsMocks';

type DataMocks = {
  [key: string]: Record<string, any>;
};

const dataMocks: DataMocks = {
  ...legacyMocks,
  ...discoveryMocks,
  ...identityMocks,
  ...offersMocks,
  ...redemptionsMocks,
};

export default dataMocks;
