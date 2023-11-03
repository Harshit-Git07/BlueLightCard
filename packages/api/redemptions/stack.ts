import { Identity } from '@blc-mono/identity/stack';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1Api, StackContext, use } from 'sst/constructs';
import { Shared } from '../../../stacks/stack';
import { ApiGatewayModelGenerator } from '../core/src/extensions/apiGatewayExtension/agModelGenerator';
import { PostAffiliateModel } from './src/models/postAffiliate';
import { PostSpotifyModel } from './src/models/postSpotify';
import { PostAffiliate } from './src/routes/postAffiliate';
import { PostSpotify } from './src/routes/postSpotify';

export function Redemptions({ stack }: StackContext) {
  const { certificateArn } = use(Shared);
  const { cognito } = use(Identity);

  //set tag service identity to all resources
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

  // Create Lambda Based API Routes
  api.addRoutes(stack, {
    ['POST /member/connection/affiliate']: new PostAffiliate(
      apiGatewayModelGenerator,
      postAffiliateModel,
      stack,
      api.cdk.restApi,
    ).postAffiliate(),

    ['POST /member/online/single-use/custom/spotify']: new PostSpotify(
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
