import { SSTConfig } from 'sst';
import { Identity } from '@blc-mono/identity/stack';
import { Offers } from '@blc-mono/offers/stack';
import { OffersCMS } from '@blc-mono/offers-cms/stack';
import { Web } from 'client/stack';
import { Shared } from './stacks/stack';
import { Redemptions } from '@blc-mono/redemptions/infrastructure/stack';
import { MemberServicesHub } from 'member-services-hub/stack';
import { Discovery } from '@blc-mono/discovery/infrastructure/stack';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';

export default {
  config(_input) {
    return {
      name: 'blc-mono',
      region: 'eu-west-2',
    };
  },

  async stacks(app) {
    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      environment: {
        JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
      },
    });

    // Remove all resources in the stack for preview environments
    if (!isProduction(app.stage) && !isStaging(app.stage)) {
      app.setDefaultRemovalPolicy('destroy');
    }
    app.stack(Shared, { id: 'global' }).stack(Identity, { id: 'identity' });

    await Promise.all([
      // Add async stacks here https://docs.sst.dev/constructs/Stack#async-stacks
      app.stack(Redemptions, { id: 'redemptions' }),
      app.stack(Offers, { id: 'offers' }),
      app.stack(Discovery, { id: 'discovery' }),
      app.stack(OffersCMS, { id: 'offers-cms' }),
    ]);

    app.stack(Web, { id: 'web' }).stack(MemberServicesHub, { id: 'member-services-hub' });
  },
} satisfies SSTConfig;

//event bridge
//cognito
//DB
