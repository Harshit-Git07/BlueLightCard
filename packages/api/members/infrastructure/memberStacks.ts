import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { MembersStack } from '@blc-mono/members/infrastructure/stacks/members-stack/membersStack';
import { MembersApiStack } from '@blc-mono/members/infrastructure/stacks/members-api-stack/membersApiStack';
import { MembersAdminApiStack } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/membersAdminApiStack';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';
import { MembersEventsStack } from '@blc-mono/members/infrastructure/stacks/event-stack/membersEventStack';
import { App } from 'sst/constructs';
import {
  deploymentGroup,
  skipDeployment,
} from '@blc-mono/members/infrastructure/utils/deploymentGroup';

const canDeploy =
  getEnvOrDefault(MemberStackEnvironmentKeys.SKIP_MEMBERS_STACK, 'false') === 'false';

export function memberStacks(app: App): Promise<void> {
  if (!canDeploy) return skipDeployment();

  // Deploy in order (and group things that don't depend on each other together as SST V2 doesn't seem smart enough to build them in the right order for us
  return deploymentGroup(
    app,
    {
      id: 'members',
      stack: MembersStack,
    },
    [
      {
        id: 'members-api',
        stack: MembersApiStack,
      },
      {
        id: 'members-admin-api',
        stack: MembersAdminApiStack,
      },
    ],
    {
      id: 'members-events',
      stack: MembersEventsStack,
    },
  );
}
