import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1Api, StackContext, use } from 'sst/constructs';

import { Shared } from '../../../stacks/stack';
import { ApiGatewayModelGenerator } from '../core/src/extensions/apiGatewayExtension';
import { Identity } from '../identity/stack';

import { RedemptionsConfigResolver } from './src/config/config';
import { EnvironmentKeys } from './src/constants/environment';
import { RedemptionsDatabase } from './src/database/database';
import { EventBridge } from './src/eventBridge/eventBridge';
import { LinkEvents, OfferEvents, PromotionEvents, VaultEvents } from './src/eventBridge/events/';
import { createLinkRule, createOfferRule, createPromotionRule, createVaultRule } from './src/eventBridge/rules';
import { PostAffiliateModel } from './src/models/postAffiliate';
import { PostRedeemModel } from './src/models/postRedeem';
import { PostSpotifyModel } from './src/models/postSpotify';
import { Route } from './src/routes/route';
import { Routes } from './src/routes/routes';

export async function Redemptions({ app, stack }: StackContext) {
  const { certificateArn, vpc } = use(Shared);
  const { cognito } = use(Identity);

  // set tag service identity to all resources
  stack.tags.setTag('service', 'redemptions');
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  // Config
  const config = RedemptionsConfigResolver.for(stack);

  // Create Database
  const database = new RedemptionsDatabase(app, stack, vpc);
  await database.setup();

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
  const postRedeemModel = apiGatewayModelGenerator.generateModel(PostRedeemModel);

  // TODO: Pass through DB variables for lambdas
  // eslint-disable-next-line no-new
  new EventBridge(stack, [
    createLinkRule({
      ruleName: 'linkRule',
      events: [LinkEvents.LINK_CREATED, LinkEvents.LINK_UPDATED],
      permissions: [],
      stack,
    }),
    createVaultRule({
      ruleName: 'vaultRule',
      events: [VaultEvents.VAULT_CREATED, VaultEvents.VAULT_UPDATED],
      permissions: [],
      stack,
    }),
    createPromotionRule({
      ruleName: 'promotionRule',
      events: [PromotionEvents.PROMOTION_UPDATED],
      permissions: [],
      stack,
    }),
    createOfferRule({
      ruleName: 'offerRule',
      events: [OfferEvents.OFFER_CREATED, OfferEvents.OFFER_UPDATED],
      permissions: [],
      stack,
    }),
  ]);

  const allRoutes = new Routes();
  const restApi = api.cdk.restApi;

  allRoutes.addRoutes(api, stack, {
    'POST /member/redeem': Route.createRoute({
      model: postRedeemModel,
      apiGatewayModelGenerator,
      stack,
      restApi,
      handler: 'packages/api/redemptions/src/handlers/redeem/postRedeem.handler',
      requestValidatorName: 'PostRedeemValidator',
    }),
    'POST /member/connection/affiliate': Route.createRoute({
      model: postAffiliateModel,
      apiGatewayModelGenerator,
      stack,
      restApi,
      handler: 'packages/api/redemptions/src/handlers/affiliate/postAffiliate.handler',
      requestValidatorName: 'PostAffiliateValidator',
    }),
    'POST /member/online/single-use/custom/spotify': Route.createRoute({
      model: postSpotifyModel,
      apiGatewayModelGenerator,
      stack,
      restApi,
      handler: 'packages/api/redemptions/src/handlers/proxy/postSpotify.handler',
      requestValidatorName: 'PostSpotifyValidator',
      environment: {
        [EnvironmentKeys.CODES_REDEEMED_HOST]: config.codesRedeemedHost,
        [EnvironmentKeys.CODES_REDEEMED_ENVIRONMENT]: config.codesRedeemedEnvironment,
        [EnvironmentKeys.CODE_REDEEMED_PATH]: config.codeRedeemedPath,
        [EnvironmentKeys.CODE_ASSIGNED_REDEEMED_PATH]: config.codeAssignedRedeemedPath,
      },
    }),
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
