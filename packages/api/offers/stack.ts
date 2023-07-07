import { StackContext, ApiGatewayV1Api } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '../core/src/extensions/apiGatewayExtension/agModelGenerator';
import { UserModel } from './src/models/user';
import { ResponseModel } from '../core/src/extensions/apiGatewayExtension/responseModel';
import { MethodResponses } from '../core/src/extensions/apiGatewayExtension/methodResponse';
import { GerUserRoute } from './src/routes/getUserRoute';

export function Offers({ stack }: StackContext) {
  const offersApi = new ApiGatewayV1Api(stack, 'offers', {
    defaults: {
      function: {
        timeout: 20,
        environment: { service: 'offers' },
      },
    },
  });


  const apiGatewayModelGenerator = new ApiGatewayModelGenerator(offersApi);
  const agUserModel = apiGatewayModelGenerator.generateModel(UserModel);

  offersApi.addRoutes(stack, {
    'GET /user/{id}': new GerUserRoute(apiGatewayModelGenerator, agUserModel).getRouteDetails(),
    'POST /user': {
      function: {
        handler: 'packages/api/offers/src/offers/lambda.post',
      },
      cdk: {
        method: {
          requestModels: { 'application/json': agUserModel.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('201', agUserModel),
            apiGatewayModelGenerator.getError400(),
            ...apiGatewayModelGenerator.getDefault4xxErrors(),
            ...apiGatewayModelGenerator.getDefault5xxErrors()
          ]),
        },
      },
    },
    'PUT /user/{id}': {
      function: {
        handler: 'packages/api/offers/src/offers/lambda.put',
      },
      cdk: {
        method: {
          requestModels: { 'application/json': agUserModel.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', agUserModel),
            apiGatewayModelGenerator.getError400(),
            apiGatewayModelGenerator.getError404(),
            apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    },
    'DELETE /user/{id}': {
      function: {
        handler: 'packages/api/offers/src/offers/lambda.remove',
      },
      cdk: {
        method: {
          requestModels: { 'application/json': agUserModel.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', agUserModel),
            apiGatewayModelGenerator.getError400(),
            apiGatewayModelGenerator.getError404(),
            apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    },
  });

  stack.addOutputs({
    OffersApiEndpoint: offersApi.url,
  });

  return {
    offersApi: offersApi,
  };
}
