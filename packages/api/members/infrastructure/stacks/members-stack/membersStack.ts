import { StackContext } from 'sst/constructs';
import { Buckets } from '@blc-mono/members/infrastructure/stacks/members-stack/s3/buckets';
import { FileBatching } from '@blc-mono/members/infrastructure/stacks/members-stack/batching/fileBatching';
import { OpenSearch } from '@blc-mono/members/infrastructure/stacks/members-stack/open-search/openSearch';
import { DynamoDbTables } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/dynamoDbTables';
import { createSeedOrganisationsLambda } from '@blc-mono/members/infrastructure/stacks/members-stack/lambdas/createSeedOrganisationsLambda';
import { SERVICE_NAME } from '@blc-mono/members/infrastructure/stacks/shared/Constants';
import { getDefaultFunctionProps } from '@blc-mono/members/infrastructure/stacks/shared/builders/defaultFunctionPropsBuilder';

export async function MembersStack({ app, stack }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);
  stack.setDefaultFunctionProps(getDefaultFunctionProps(stack.region));

  const tables = new DynamoDbTables(stack);
  const buckets = new Buckets(app, stack, tables);

  const openSearch = new OpenSearch(stack, tables);
  await openSearch.setup();

  if (FileBatching.isEnabled()) {
    new FileBatching(stack, tables, buckets);
  }

  // I'm not sure if this is used or needed anymore
  createSeedOrganisationsLambda(stack, tables);

  return {
    tables,
    buckets,
    openSearch,
  };
}
