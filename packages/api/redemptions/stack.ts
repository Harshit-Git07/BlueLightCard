import { StackContext, ApiGatewayV1Api } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '../core/src/extensions/apiGatewayExtension/agModelGenerator';
import { RedemptionModel } from './src/models/redemption';
import { GetRedemptionRoute } from './src/routes/get-redemption'

export function Redemptions({ stack }: StackContext) {
    //set tag service identity to all resources
    stack.tags.setTag('service', 'redemptions');
    stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');

    const api = new ApiGatewayV1Api(stack, 'redemptions', {
        defaults: {
            function: {
                timeout: 20,
                environment: { service: 'redemptions' }
            },
        }
    });

    const apiGatewayModelGenerator = new ApiGatewayModelGenerator(api.cdk.restApi);
    const redemptionModel = apiGatewayModelGenerator.generateModel(RedemptionModel);

    api.addRoutes(stack, {
        'GET /': new GetRedemptionRoute(apiGatewayModelGenerator, redemptionModel).getRouteDetails()
    });


    stack.addOutputs({
        RedemptionsApiEndpoint: api.url,
    });

    return {
        api
    };
}