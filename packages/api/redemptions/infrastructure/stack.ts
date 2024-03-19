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
import { GetRedemptionDetailsModel } from '../libs/models/getRedemptionDetails';

import { RedemptionsStackConfigResolver } from './config/config';
import { RedemptionsStackEnvironmentKeys } from './constants/environment';
import { RedemptionsDatabase } from './database/database';
import { EventBridge } from './eventBridge/eventBridge';
import {
  createLinkRule,
  createOfferRule,
  createPromotionUpdatedRule,
  createVaultUpdatedRule,
  updateOfferRule,
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
        defaultCorsPreflightOptions: {
          allowOrigins: config.apiDefaultAllowedOrigins,
          allowHeaders: ['*'],
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowCredentials: true,
        },
      },
    },
  });

  // Create API Models
  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(api.cdk.restApi);
  const postSpotifyModel = apiGatewayModelGenerator.generateModel(PostSpotifyModel);
  const postAffiliateModel = apiGatewayModelGenerator.generateModel(PostAffiliateModel);
  const postRedeemModel = apiGatewayModelGenerator.generateModel(PostRedeemModel);
  const getRedemptionDetailsModel = apiGatewayModelGenerator.generateModel(GetRedemptionDetailsModel);

  new EventBridge(stack, {
    linkRule: createLinkRule(stack),
    vaultCreatedRule: createVaultCreatedRule(stack, database),
    vaultUpdatedRule: createVaultUpdatedRule(stack, database),
    promotionUpdatedRule: createPromotionUpdatedRule(stack, database, config),
    offerRule: createOfferRule(stack, database),
    offerUpdatedRule: updateOfferRule(stack, database),
  });

  const allRoutes = new Routes();
  const restApi = api.cdk.restApi;

  // Create permissions
  // TODO: Specify the resource for the secrets manager from Secret.fromSecretCompleteArn (It was not getting the final 6 characters as expected, need to investigate further)
  const getSecretValueSecretsManager = new PolicyStatement({
    actions: ['secretsmanager:GetSecretValue'],
    effect: Effect.ALLOW,
    resources: ['*'],
  });

  // functionName is automatically appended with the stage name
  allRoutes.addRoutes(api, stack, {
    'POST /member/redemptionDetails': Route.createRoute({
      model: getRedemptionDetailsModel,
      apiGatewayModelGenerator,
      stack,
      functionName: 'GetRedemptionDetailsHandler',
      restApi,
      database,
      handler:
        'packages/api/redemptions/application/handlers/apiGateway/redemptionDetails/getRedemptionDetails.handler',
      requestValidatorName: 'GetRedemptionDetailsValidator',
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
    }),
    'POST /member/redeem': Route.createRoute({
      model: postRedeemModel,
      apiGatewayModelGenerator,
      stack,
      functionName: 'PostRedeemHandler',
      restApi,
      database,
      handler: 'packages/api/redemptions/application/handlers/apiGateway/redeem/postRedeem.handler',
      requestValidatorName: 'PostRedeemValidator',
      environment: {
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST]: config.redemptionsLambdaScriptsHost,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT]:
          config.redemptionsLambdaScriptsEnvironment,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODE_REDEEMED_PATH]:
          config.redemptionsLambdaScriptsCodeRedeemedPath,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH]:
          config.redemptionsLambdaScriptsAssignUserCodesRedeemedPath,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH]:
          config.redemptionsLambdaScriptsCodeAmountIssuedPath,
      },
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
      permissions: [getSecretValueSecretsManager],
    }),
    'POST /member/connection/affiliate': Route.createRoute({
      model: postAffiliateModel,
      apiGatewayModelGenerator,
      functionName: 'PostAffiliateHandler',
      stack,
      restApi,
      handler: 'packages/api/redemptions/application/handlers/apiGateway/affiliate/postAffiliate.handler',
      requestValidatorName: 'PostAffiliateValidator',
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
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
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST]: config.redemptionsLambdaScriptsHost,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT]:
          config.redemptionsLambdaScriptsEnvironment,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODE_REDEEMED_PATH]:
          config.redemptionsLambdaScriptsCodeRedeemedPath,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH]:
          config.redemptionsLambdaScriptsAssignUserCodesRedeemedPath,
        [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER]:
          config.redemptionsLambdaScriptsSecretManager,
      },
      defaultAllowedOrigins: config.apiDefaultAllowedOrigins,
      permissions: [getSecretValueSecretsManager],
    }),
  });

  stack.addOutputs({
    RedemptionsApiEndpoint: api.url,
  });

  return {
    api,
  };
}
