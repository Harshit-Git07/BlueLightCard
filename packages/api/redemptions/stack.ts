import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1Api, StackContext, use } from 'sst/constructs';

import { Shared } from '../../../stacks/stack';
import { ApiGatewayModelGenerator } from '../core/src/extensions/apiGatewayExtension';
import { Identity } from '../identity/stack';

import { Tables } from './databases/tables';
import { EventBridge } from './eventBridge/eventBridge';
import { LinkEvents, OfferEvents, PromotionEvents, VaultEvents } from './eventBridge/events/';
import { createLinkRule, createOfferRule, createPromotionRule, createVaultRule } from './eventBridge/rules';
import { PostAffiliateModel } from './src/models/postAffiliate';
import { PostSpotifyModel } from './src/models/postSpotify';
import { PostAffiliate } from './src/routes/postAffiliate';
import { PostSpotify } from './src/routes/postSpotify';

export function Redemptions({ stack }: StackContext): {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: ApiGatewayV1Api<any>;
} {
  const { certificateArn } = use(Shared);
  const { cognito } = use(Identity);

  // set tag service identity to all resources
  stack.tags.setTag('service', 'redemptions');
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  const api = new ApiGatewayV1Api(stack, 'redemptions', {
    authorizers: {
      Authorizer: {
        type: 'user_pools',
        userPoolIds: [cognito.userPoolId],
      },
    },
    defaults: {
      authorizer: 'Authorizer',
      function: {
        timeout: 20,
        environment: { service: 'redemptions' },
      },
    },
    cdk: {
      restApi: {
        ...(['production', 'staging'].includes(stack.stage) &&
          certificateArn && {
            domainName: {
              domainName:
                stack.stage === 'production' ? 'redemptions.blcshine.io' : `${stack.stage}-redemptions.blcshine.io`,
              certificate: Certificate.fromCertificateArn(stack, 'DomainCertificate', certificateArn),
            },
          }),
        deployOptions: {
          stageName: 'v1',
        },
      },
    },
  });

  // Create API Models
  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(api.cdk.restApi);
  const postSpotifyModel = apiGatewayModelGenerator.generateModel(PostSpotifyModel);
  const postAffiliateModel = apiGatewayModelGenerator.generateModel(PostAffiliateModel);
  const tables = new Tables(stack);

  // eslint-disable-next-line no-new
  new EventBridge(stack, [
    createLinkRule({
      ruleName: 'linkRule',
      events: [LinkEvents.LINK_CREATED, LinkEvents.LINK_UPDATED],
      permissions: [],
      stack,
      table: tables.redemptionConfig,
    }),
    createVaultRule({
      ruleName: 'vaultRule',
      events: [VaultEvents.VAULT_CREATED, VaultEvents.VAULT_UPDATED],
      permissions: [],
      stack,
      table: tables.redemptionConfig,
    }),
    createPromotionRule({
      ruleName: 'promotionRule',
      events: [PromotionEvents.PROMOTION_UPDATED],
      permissions: [],
      stack,
      table: tables.redemptionConfig,
    }),
    createOfferRule({
      ruleName: 'offerRule',
      events: [OfferEvents.OFFER_CREATED, OfferEvents.OFFER_UPDATED],
      permissions: [],
      stack,
      table: tables.redemptionConfig,
    }),
  ]);
  // Create Lambda Based API Routes
  api.addRoutes(stack, {
    'POST /member/connection/affiliate': new PostAffiliate(
      apiGatewayModelGenerator,
      postAffiliateModel,
      stack,
      api.cdk.restApi,
    ).postAffiliate(),

    'POST /member/online/single-use/custom/spotify': new PostSpotify(
      apiGatewayModelGenerator,
      postSpotifyModel,
      stack,
      api.cdk.restApi,
    ).postSpotify(),
  });

  // Attach Permissions to Lambda
  api.attachPermissionsToRoute('POST /member/online/single-use/custom/spotify', [
    new PolicyStatement({
      actions: ['secretsmanager:GetSecretValue'],
      effect: Effect.ALLOW,
      resources: ['*'],
    }),
  ]);

  stack.addOutputs({
    RedemptionsApiEndpoint: api.url,
  });

  return {
    api,
  };
}
