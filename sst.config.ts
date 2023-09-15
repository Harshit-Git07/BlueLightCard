import { SSTConfig } from 'sst';
import { Identity } from './packages/api/identity/stack';
import { Offers } from './packages/api/offers/stack';
import { Web } from './packages/web/stack';
import { Shared } from './stacks/stack';
import { CMS } from './packages/cms/stack';
import { Redemptions } from './packages/api/redemptions/stack';

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
    // Remove all resources in the stack for preview environments
    if (app.stage !== 'production' && app.stage !== 'staging') {
      app.setDefaultRemovalPolicy('destroy');
    }
    app
      .stack(Shared, { id: 'global' })
      .stack(Identity, { id: 'identity' })
      .stack(Offers, { id: 'offers' })
      .stack(Web, { id: 'web' })
      .stack(CMS, { id: 'cms' })
      .stack(Redemptions, { id: 'redemptions'});
  },
} satisfies SSTConfig;

//event bridge
//cognito
//DB
