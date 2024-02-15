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
      Authorizer: {
        type: 'user_pools',
        userPoolIds: [cognito.userPoolId],
      },
    },
    defaults: {
      authorizer: 'Authorizer',
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
    vaultRule: createVaultRule(stack, database),
    promotionRule: createPromotionRule(stack),
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
      handler: 'packages/api/redemptions/src/handlers/redeem/postRedeem.handler',
      requestValidatorName: 'PostRedeemValidator',
    }),
    'POST /member/connection/affiliate': Route.createRoute({
      model: postAffiliateModel,
      apiGatewayModelGenerator,
      functionName: `PostAffiliateHandler`,
      stack,
      restApi,
      handler: 'packages/api/redemptions/src/handlers/affiliate/postAffiliate.handler',
      requestValidatorName: 'PostAffiliateValidator',
    }),
    'POST /member/online/single-use/custom/spotify': Route.createRoute({
      model: postSpotifyModel,
      apiGatewayModelGenerator,
      stack,
      functionName: 'PostSpotifyHandler',
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
