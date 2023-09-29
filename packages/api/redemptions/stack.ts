import { Identity } from '@blc-mono/identity/stack';
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ApiGatewayV1Api, StackContext, use } from 'sst/constructs';
import { Shared } from '../../../stacks/stack';
import { ApiGatewayModelGenerator } from '../core/src/extensions/apiGatewayExtension/agModelGenerator';
import { Documentation } from './src/constructs/documentation';
import { PostAffiliateResponse } from './src/models/postAffiliateResponse';
import { GetHealthcheck } from './src/routes/getHealthcheck';
import { PostAffiliate } from './src/routes/postAffiliate';

export function Redemptions({ stack }: StackContext) {
    const { certificateArn } = use(Shared);
    const { cognito } = use(Identity);
    // TODO: Automate documentation versioning
    const documentationVersion = '1.0.0';

    //set tag service identity to all resources
    stack.tags.setTag('service', 'redemptions');
    stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');
    
    const api = new ApiGatewayV1Api(stack, 'redemptions', {
        authorizers: {
            Authorizer: {
              type: "user_pools",
              userPoolIds: [cognito.userPoolId],
            },
        },
        defaults: {
            authorizer: "Authorizer",
            function: {
                timeout: 20,
                environment: { service: 'redemptions' }
            },
        },
        cdk: {
            restApi: {
                ...(['production', 'staging'].includes(stack.stage) && certificateArn && { 
                    domainName: {
                        domainName: stack.stage === 'production' ? 'redemptions.blcshine.io' : `${stack.stage}-redemptions.blcshine.io`,
                        certificate: Certificate.fromCertificateArn(stack, "DomainCertificate", certificateArn), 
                    },
                }),
                deployOptions: {
                    stageName: 'v1',
                    documentationVersion
                },
            }
        }
    });
    
    // Create API Documentation
    new Documentation(stack, api.restApiId, documentationVersion);
    
    // Create API Models
    const apiGatewayModelGenerator = new ApiGatewayModelGenerator(api.cdk.restApi);
    const postAffiliateModel = apiGatewayModelGenerator.generateModel(PostAffiliateResponse);
    
    // Create API Routes
    api.addRoutes(stack, {
        // The GET healthcheck forces a new deployment in order for the new Documentation Version to take effect.
        [`GET /healthcheck/${documentationVersion}`]: new GetHealthcheck(apiGatewayModelGenerator).getHealthcheck(),
        'POST /member/connection/affiliate': new PostAffiliate(apiGatewayModelGenerator, postAffiliateModel, stack, api.cdk.restApi).postAffiliate()
    });

    stack.addOutputs({
        RedemptionsApiEndpoint: api.url,
    });

    return {
        api
    };
}