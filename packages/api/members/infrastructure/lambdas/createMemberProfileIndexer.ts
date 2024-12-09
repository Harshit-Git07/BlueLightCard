import { Function, Queue, Stack } from 'sst/constructs';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import {
  MemberStackConfigResolver,
  MemberStackRegion,
} from '@blc-mono/members/infrastructure/config/config';

export function createMemberProfileIndexer(
  stack: Stack,
  vpc: IVpc,
  memberProfilesTableEventQueue: Queue,
  openSearchDomainEndpoint: string,
  service: string,
): void {
  const config = MemberStackConfigResolver.for(stack, stack.region as MemberStackRegion);

  const memberProfileIndexer = new Function(stack, 'MemberProfileIndexer', {
    handler:
      'packages/api/members/application/handlers/admin/opensearch/memberProfileIndexer.handler',
    environment: {
      OPENSEARCH_DOMAIN_ENDPOINT: config.openSearchDomainEndpoint ?? openSearchDomainEndpoint,
      STAGE: stack.stage ?? '',
      SERVICE: service,
    },
    permissions: ['es'],
    vpc,
    deadLetterQueueEnabled: true,
  });

  memberProfileIndexer.addEventSource(
    new SqsEventSource(memberProfilesTableEventQueue.cdk.queue, {
      batchSize: 10,
      maxConcurrency: 50,
      // TODO: Enable once initial data ingestion is complete
      enabled: false,
    }),
  );

  memberProfilesTableEventQueue.cdk.queue.grantConsumeMessages(memberProfileIndexer);
}
