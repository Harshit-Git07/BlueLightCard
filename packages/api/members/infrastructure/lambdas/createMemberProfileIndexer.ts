import { Function, Queue, Stack, Table } from 'sst/constructs';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import {
  MemberStackConfigResolver,
  MemberStackRegion,
} from '@blc-mono/members/infrastructure/config/config';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export function createMemberProfileIndexer(
  stack: Stack,
  vpc: IVpc,
  memberProfilesTableEventQueue: Queue,
  openSearchDomainEndpoint: string,
  organisationsTable: Table,
  service: string,
): void {
  const config = MemberStackConfigResolver.for(stack, stack.region as MemberStackRegion);

  const memberProfileIndexer = new Function(stack, 'MemberProfileIndexer', {
    handler: 'packages/api/members/application/handlers/admin/search/memberProfileIndexer.handler',
    environment: {
      [MemberStackEnvironmentKeys.MEMBERS_OPENSEARCH_DOMAIN_ENDPOINT]:
        config.openSearchDomainEndpoint ?? openSearchDomainEndpoint,
      STAGE: stack.stage ?? '',
      SERVICE: service,
    },
    permissions: ['es'],
    bind: [organisationsTable],
    vpc,
    deadLetterQueueEnabled: true,
  });

  memberProfileIndexer.addEventSource(
    new SqsEventSource(memberProfilesTableEventQueue.cdk.queue, {
      batchSize: 10,
      maxConcurrency: 50,
    }),
  );

  memberProfilesTableEventQueue.cdk.queue.grantConsumeMessages(memberProfileIndexer);
}
