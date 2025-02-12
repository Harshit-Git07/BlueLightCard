import { Bucket, Config, EventBusRuleProps, Table } from 'sst/constructs';

export function memberEventRules(
  profilesTable: Table,
  organisationsTable: Table,
  documentUploadBucket: Bucket,
  emailTemplatesBucketName: Config.Parameter,
): Record<string, EventBusRuleProps> {
  return {
    memberEventSystemRule: {
      pattern: { source: ['member.event.system'] },
      targets: {
        target: {
          function: {
            handler: 'packages/api/members/application/handlers/eventbus/memberEventSystem.handler',
            timeout: 10,
            bind: [
              profilesTable,
              organisationsTable,
              documentUploadBucket,
              emailTemplatesBucketName,
            ],
          },
        },
      },
    },
    memberEventBrazeRule: {
      pattern: { source: ['member.event.braze'] },
      targets: {
        target: {
          function: {
            handler: 'packages/api/members/application/handlers/eventbus/memberEventBraze.handler',
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
            handler: 'packages/api/members/application/handlers/eventbus/memberEventEmail.handler',
            timeout: 10,
            bind: [profilesTable],
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
            handler: 'packages/api/members/application/handlers/eventbus/memberEventLegacy.handler',
            timeout: 10,
            permissions: ['events:PutEvents'],
          },
        },
      },
    },
  };
}
