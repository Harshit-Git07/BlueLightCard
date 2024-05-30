import { SSTConfig } from 'sst';
import { Identity } from './packages/api/identity/stack';
import { Offers } from './packages/api/offers/stack';
import { Web } from './packages/web/stack';
import { Shared } from './stacks/stack';
import { Redemptions } from './packages/api/redemptions/infrastructure/stack';
import { MemberServicesHub } from './packages/member-services-hub/stack';
import { Discovery } from "./packages/api/discovery/infrastructure/stack";
import { DDS_UK } from '@blc-mono/offers/src/utils/global-constants';

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

    const isDDSEnabled = process.env.DDS_ENABLED === 'true';

    // Remove all resources in the stack for preview environments
    if (app.stage !== 'production' && app.stage !== 'staging') {
      app.setDefaultRemovalPolicy('destroy');
    }
    app.stack(Shared, { id: 'global' }).stack(Identity, { id: 'identity' });

    await Promise.all([
      // Add async stacks here https://docs.sst.dev/constructs/Stack#async-stacks
      app.stack(Redemptions, { id: 'redemptions' }),
      app.stack(Offers, { id: 'offers' }),
      isDDSEnabled ? app.stack(Offers, { stackName: `${app.stage}-${DDS_UK}-offers` }) : undefined,
      app.stack(Discovery, { id: 'discovery' }),
    ]);

    app.stack(Web, { id: 'web' }).stack(MemberServicesHub, { id: 'member-services-hub' });
  },
} satisfies SSTConfig;

//event bridge
//cognito
//DB
