import { Construct } from 'constructs';
import { Queue, Stack, use } from 'sst/constructs';
import { DynamoDbTables } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/dynamoDbTables';
import { createMemberProfileChangeEventEmitters } from '@blc-mono/members/infrastructure/stacks/members-stack/open-search/events/emitters/memberProfileChangeEventEmitters';
import { createMemberProfileChangeEventReceiver } from '@blc-mono/members/infrastructure/stacks/members-stack/open-search/events/recievers/memberProfileChangeEventReceivers';
import { createIndexTableDataSeeder } from '@blc-mono/members/infrastructure/stacks/members-stack/open-search/data-seeding/createIndexTableDataSeeder';
import { getOpenSearchDomain } from '@blc-mono/members/infrastructure/stacks/members-stack/open-search/events/recievers/domain/MembersOpenSearchDomain';
import { Shared } from '../../../../../../../stacks/stack';
import { memberStackConfiguration } from '@blc-mono/members/infrastructure/stacks/shared/config/config';

export class OpenSearch extends Construct {
  openSearchDomain: string;

  constructor(
    private stack: Stack,
    private tables: DynamoDbTables,
  ) {
    super(stack, 'OpenSearch');

    this.openSearchDomain = 'infrastructure did not call setup function';
  }

  async setup(): Promise<void> {
    const { vpc } = use(Shared);

    const config = memberStackConfiguration(this.stack);
    this.openSearchDomain =
      config.openSearchDomainEndpoint ?? (await getOpenSearchDomain(this.stack, vpc));

    const memberProfilesChangeEventQueue = new Queue(this.stack, 'MemberProfilesTableEventQueue', {
      cdk: {
        queue: {
          deadLetterQueue: {
            queue: new Queue(this.stack, 'MemberProfilesTableEventQueueDeadLetterQueue').cdk.queue,
            maxReceiveCount: 3,
          },
        },
      },
    });

    createMemberProfileChangeEventEmitters(this.stack, this.tables, memberProfilesChangeEventQueue);
    createMemberProfileChangeEventReceiver(
      this.stack,
      this.tables,
      memberProfilesChangeEventQueue,
      this.openSearchDomain,
    );
    createIndexTableDataSeeder(this.stack, this.tables);
  }
}
