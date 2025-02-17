import { StackContext, use } from 'sst/constructs';
import { MembersStack } from '@blc-mono/members/infrastructure/stacks/members-stack/membersStack';
import { getDefaultFunctionProps } from '@blc-mono/members/infrastructure/stacks/shared/builders/defaultFunctionPropsBuilder';
import { SERVICE_NAME } from '@blc-mono/members/infrastructure/stacks/shared/Constants';
import { createRestApi } from '@blc-mono/members/infrastructure/stacks/shared/rest-api/createRestApi';
import { memberProfileRoutes } from '@blc-mono/members/infrastructure/stacks/members-api-stack/routes/MemberProfileRoutes';
import { memberApplicationRoutes } from '@blc-mono/members/infrastructure/stacks/members-api-stack/routes/MemberApplicationRoutes';
import { memberOrganisationsRoutes } from '@blc-mono/members/infrastructure/stacks/members-api-stack/routes/MemberOrganisationsRoutes';
import { memberMarketingRoutes } from '@blc-mono/members/infrastructure/stacks/members-api-stack/routes/MemberMarketingRoutes';
import { DefaultRouteProps } from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';

export async function MembersApiStack({ app, stack }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);
  stack.setDefaultFunctionProps(getDefaultFunctionProps(stack.region));

  const { tables, buckets } = use(MembersStack);

  const { api, requestValidator, config, apiGatewayModelGenerator } = createRestApi(
    app,
    stack,
    'members-api',
  );

  const defaultRouteProps: DefaultRouteProps = {
    name: '',
    stack,
    requestValidator,
    apiGatewayModelGenerator,
    defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
  };

  api.addRoutes(stack, {
    ...memberProfileRoutes({
      ...defaultRouteProps,
      bind: [tables.profilesTable, tables.organisationsTable],
    }),
    ...memberApplicationRoutes({
      ...defaultRouteProps,
      bind: [
        tables.profilesTable,
        tables.organisationsTable,
        buckets.documentUploadBucket,
        ...buckets.emailBucket.bindings,
      ],
    }),
    ...memberOrganisationsRoutes({ ...defaultRouteProps, bind: [tables.organisationsTable] }),
    ...memberMarketingRoutes({
      ...defaultRouteProps,
      bind: [...buckets.emailBucket.bindings],
    }),
  });

  stack.addOutputs({
    MembersApiEndpoint: api.url,
    MembersApiCustomDomain: api.customDomainUrl,
  });

  return {
    api,
  };
}
