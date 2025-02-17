import { StackContext, use } from 'sst/constructs';
import { adminProfileRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/AdminProfileRoutes';
import { adminSearchRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/AdminSearchRoutes';
import { adminMarketingRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/AdminMarketingRoutes';
import { adminApplicationRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/AdminApplicationRoutes';
import { adminOrganisationsRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/AdminOrganisationsRoutes';
import { adminCardRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/AdminCardRoutes';
import { adminBatchRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/AdminBatchRoutes';
import { adminPaymentRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/AdminPaymentRoutes';
import { adminEmailRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/AdminEmailRoutes';
import { MembersStack } from '@blc-mono/members/infrastructure/stacks/members-stack/membersStack';
import { SERVICE_NAME } from '@blc-mono/members/infrastructure/stacks/shared/Constants';
import { createRestApi } from '@blc-mono/members/infrastructure/stacks/shared/rest-api/createRestApi';
import { DefaultRouteProps } from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';
import { Shared } from '../../../../../../stacks/stack';
import { getDefaultFunctionProps } from '@blc-mono/members/infrastructure/stacks/shared/builders/defaultFunctionPropsBuilder';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export async function MembersAdminApiStack({ app, stack }: StackContext) {
  stack.tags.setTag('service', SERVICE_NAME);
  stack.setDefaultFunctionProps(getDefaultFunctionProps(stack.region));

  const { vpc } = use(Shared);
  const { tables, buckets, openSearch } = use(MembersStack);

  const { api, requestValidator, config, apiGatewayModelGenerator } = createRestApi(
    app,
    stack,
    'members-admin-api',
  );

  const defaultRouteProps: DefaultRouteProps = {
    name: '',
    stack,
    requestValidator,
    apiGatewayModelGenerator,
    defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
  };

  api.addRoutes(stack, {
    ...adminProfileRoutes({
      ...defaultRouteProps,
      bind: [tables.profilesTable, tables.organisationsTable],
    }),
    ...adminSearchRoutes(
      {
        ...defaultRouteProps,
        environment: {
          [MemberStackEnvironmentKeys.STAGE]: stack.stage,
          [MemberStackEnvironmentKeys.MEMBERS_OPENSEARCH_DOMAIN_ENDPOINT]:
            config.openSearchDomainEndpoint ?? openSearch.openSearchDomain,
        },
      },
      vpc,
    ),
    ...adminMarketingRoutes(defaultRouteProps),
    ...adminApplicationRoutes({
      ...defaultRouteProps,
      environment: {
        EMAIL_SERVICE_BRAZE_API_KEY: process.env.EMAIL_SERVICE_BRAZE_API_KEY,
        EMAIL_SERVICE_BRAZE_VERIFICATION_CAMPAIGN_ID:
          process.env.EMAIL_SERVICE_BRAZE_VERIFICATION_CAMPAIGN_ID,
        EMAIL_SERVICE_AUTH0_LOGIN_URL: process.env.AUTH0_LOGIN_URL,
        EMAIL_SERVICE_BRAND: process.env.BRAND,
      },
      permissions: ['ses:SendEmail', 's3:GetObject', 's3:DeleteObject'],
      bind: [
        tables.profilesTable,
        tables.organisationsTable,
        buckets.documentUploadBucket,
        ...buckets.emailBucket.bindings,
      ],
    }),
    ...adminOrganisationsRoutes({
      ...defaultRouteProps,
      bind: [tables.organisationsTable],
    }),
    ...adminCardRoutes({
      ...defaultRouteProps,
      bind: [tables.profilesTable, tables.adminTable, tables.organisationsTable],
    }),
    ...adminBatchRoutes({
      ...defaultRouteProps,
      bind: [tables.profilesTable, tables.adminTable, tables.organisationsTable],
    }),
    ...adminPaymentRoutes({
      ...defaultRouteProps,
      bind: [tables.adminTable],
    }),
    ...adminEmailRoutes({
      ...defaultRouteProps,
      bind: [...buckets.emailBucket.bindings],
    }),
  });

  stack.addOutputs({
    MembersAdminApiEndpoint: api.url,
    MembersAdminApiCustomDomain: api.customDomainUrl,
  });
}
