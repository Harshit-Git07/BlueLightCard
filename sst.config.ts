import { SSTConfig } from 'sst';
import { Identity } from './packages/api/identity/stack';
import { Offers } from './packages/api/offers/stack';
import { Web } from './packages/web/stack';
import { Shared } from './stacks/stack';
import { CMS } from './packages/cms/stack';

export default {
  config(_input) {
    return {
      name: 'blc-mono',
      region: 'eu-west-2',
    };
  },

  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      environment: {
        JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
      },
    });
    app
      .stack(Shared, { id: "global" })
      .stack(Identity, { id: "identity" })
      .stack(Offers, { id: 'offers' })
      .stack(Web, { id: "web" })
      .stack(CMS, { id: 'cms' });
  },
} satisfies SSTConfig;

//event bridge
//cognito
//DB
