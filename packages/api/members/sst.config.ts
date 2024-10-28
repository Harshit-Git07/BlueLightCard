import { SSTConfig } from 'sst';
import { Shared } from '../../../stacks/stack';
import { Identity } from '@blc-mono/identity/stack';
import { Members } from '@blc-mono/members/infrastructure/stack';
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

    app.stack(Shared, { id: 'global' });
    app.stack(Identity, { id: 'identity' });

    await Promise.all([app.stack(Members, { id: 'members' })]);
  },
} satisfies SSTConfig;
