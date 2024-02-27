import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1Api, StackContext, use } from 'sst/constructs';

import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { PostAffiliateModel } from '@blc-mono/redemptions/libs/models/postAffiliate';
import { PostRedeemModel } from '@blc-mono/redemptions/libs/models/postRedeem';
import { PostSpotifyModel } from '@blc-mono/redemptions/libs/models/postSpotify';

import { Shared } from '../../../../stacks/stack';
import { ApiGatewayAuthorizer } from '../../core/src/identity/authorizer';
import { Identity } from '../../identity/stack';

import { RedemptionsStackConfigResolver } from './config/config';
import { RedemptionsStackEnvironmentKeys } from './constants/environment';
import { RedemptionsDatabase } from './database/database';
import { EventBridge } from './eventBridge/eventBridge';
import {
  createLinkRule,
  createOfferRule,
  createPromotionUpdatedRule,
  createVaultUpdatedRule,
} from './eventBridge/rules';
import { createVaultCreatedRule } from './eventBridge/rules/VaultCreatedRule';
import { Route } from './routes/route';
import { Routes } from './routes/routes';

export async function Redemptions({ app, stack }: StackContext) {
  const { certificateArn, vpc } = use(Shared);
  const { authorizer } = use(Identity);

  // set tag service identity to all resources
  stack.tags.setTag('service', 'redemptions');
  stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

  // Config
  const config = RedemptionsStackConfigResolver.for(stack);

  stack.setDefaultFunctionProps({
    timeout: 20,
    environment: {
      service: 'redemptions',
    },
  });

  // Create Database
  const database = await new RedemptionsDatabase(app, stack, vpc).setup();

  const api = new ApiGatewayV1Api(stack, 'redemptions', {
    authorizers: {
      redemptionsAuthorizer: ApiGatewayAuthorizer(stack, 'ApiGatewayAuthorizer', authorizer),
    },
    defaults: {
      authorizer: 'redemptionsAuthorizer',
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

  new EventBridge(stack, {
    linkRule: createLinkRule(stack),
    vaultCreatedRule: createVaultCreatedRule(stack, database),
    vaultUpdatedRule: createVaultUpdatedRule(stack, database),
    promotionUpdatedRule: createPromotionUpdatedRule(stack, database),
    offerRule: createOfferRule(stack),
  });

  const allRoutes = new Routes();
  const restApi = api.cdk.restApi;

  // functionName is automatically appended with the stage name
  allRoutes.addRoutes(api, stack, {
    'POST /member/redeem': Route.createRoute({
      model: postRedeemModel,
      apiGatewayModelGenerator,
      stack,
      functionName: `PostRedeemHandler`,
      restApi,
      database,
      handler: 'packages/api/redemptions/application/handlers/apiGateway/redeem/postRedeem.handler',
      requestValidatorName: 'PostRedeemValidator',
    }),
    'POST /member/connection/affiliate': Route.createRoute({
      model: postAffiliateModel,
      apiGatewayModelGenerator,
      functionName: `PostAffiliateHandler`,
      stack,
      restApi,
      handler: 'packages/api/redemptions/application/handlers/apiGateway/affiliate/postAffiliate.handler',
      requestValidatorName: 'PostAffiliateValidator',
    }),
    'POST /member/online/single-use/custom/spotify': Route.createRoute({
      model: postSpotifyModel,
      apiGatewayModelGenerator,
      stack,
      functionName: 'PostSpotifyHandler',
      restApi,
      handler: 'packages/api/redemptions/application/handlers/apiGateway/proxy/postSpotify.handler',
      requestValidatorName: 'PostSpotifyValidator',
      environment: {
        [RedemptionsStackEnvironmentKeys.CODES_REDEEMED_HOST]: config.codesRedeemedHost,
        [RedemptionsStackEnvironmentKeys.CODES_REDEEMED_ENVIRONMENT]: config.codesRedeemedEnvironment,
        [RedemptionsStackEnvironmentKeys.CODE_REDEEMED_PATH]: config.codeRedeemedPath,
        [RedemptionsStackEnvironmentKeys.CODE_ASSIGNED_REDEEMED_PATH]: config.codeAssignedRedeemedPath,
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
