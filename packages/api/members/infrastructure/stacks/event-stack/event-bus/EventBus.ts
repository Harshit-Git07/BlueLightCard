import { Construct } from 'constructs';
import { Config, Stack, use } from 'sst/constructs';
import { Shared } from '../../../../../../../stacks/stack';
import { MembersApiStack } from '@blc-mono/members/infrastructure/stacks/members-api-stack/membersApiStack';
import { MembersStack } from '@blc-mono/members/infrastructure/stacks/members-stack/membersStack';

export class EventBus extends Construct {
  constructor(stack: Stack) {
    super(stack, 'EventBus');

    const { bus } = use(Shared);
    const { tables, buckets } = use(MembersStack);
    const { api } = use(MembersApiStack);

    const memberApiUrlParameter = new Config.Parameter(stack, 'member-api-url', {
      value: api.url,
    });

    bus.addRules(stack, {
      memberEventSystemRule: {
        pattern: { source: ['member.event.system'] },
        targets: {
          target: {
            function: {
              handler:
                'packages/api/members/application/handlers/eventbus/memberEventSystem.handler',
              timeout: 10,
              bind: [tables.profilesTable, ...buckets.emailBucket.bindings],
            },
          },
        },
      },
      memberEventBrazeRule: {
        pattern: { source: ['member.event.braze'] },
        targets: {
          target: {
            function: {
              handler:
                'packages/api/members/application/handlers/eventbus/memberEventBraze.handler',
              timeout: 10,
              permissions: ['sqs:SendMessage'],
            },
          },
        },
      },
      memberEventDwhRule: {
        pattern: { source: ['member.event.dwh'] },
        targets: {
          target: {
            function: {
              handler: 'packages/api/members/application/handlers/eventbus/memberEventDwh.handler',
              timeout: 10,
              permissions: ['firehose:PutRecord'],
            },
          },
        },
      },
      memberEventEmailRule: {
        pattern: { source: ['member.event.email'] },
        targets: {
          target: {
            function: {
              handler:
                'packages/api/members/application/handlers/eventbus/memberEventEmail.handler',
              timeout: 10,
              bind: [
                tables.profilesTable,
                tables.organisationsTable,
                ...buckets.emailBucket.bindings,
                memberApiUrlParameter,
              ],
              permissions: ['ses:SendEmail'],
            },
          },
        },
      },
      memberEventLegacyRule: {
        pattern: { source: ['member.event.legacy'] },
        targets: {
          target: {
            function: {
              handler:
                'packages/api/members/application/handlers/eventbus/memberEventLegacy.handler',
              timeout: 10,
              permissions: ['events:PutEvents'],
            },
          },
        },
      },
    });
  }
}
