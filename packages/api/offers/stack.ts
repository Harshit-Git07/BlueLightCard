import { StackContext, ApiGatewayV1Api } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '../core/src/extensions/apiGatewayExtension/agModelGenerator';
import { UserModel } from './src/models/user';
import { GetUserByIdRoute } from './src/routes/getUserByIdRoute';
import { PostUserRoute } from './src/routes/postUserRoute';
import { PutUserByIdRoute } from './src/routes/putUserByIdRoute';
import { DeleteUserByIdRoute } from './src/routes/deleteUserByIdRoute';

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
    'GET /user/{id}': new GetUserByIdRoute(apiGatewayModelGenerator, agUserModel).getRouteDetails(),
    'POST /user': new PostUserRoute(apiGatewayModelGenerator, agUserModel).getRouteDetails(),
    'PUT /user/{id}': new PutUserByIdRoute(apiGatewayModelGenerator, agUserModel).getRouteDetails(),
    'DELETE /user/{id}': new DeleteUserByIdRoute(apiGatewayModelGenerator).getRouteDetails(),
  });

  stack.addOutputs({
    OffersApiEndpoint: offersApi.url,
  });

  return {
    offersApi: offersApi,
  };
}
