import { ApiGatewayV1Api, ApiGatewayV1ApiAuthorizer, ApiGatewayV1ApiRouteProps, Stack } from 'sst/constructs';

export class Routes {
  addRoutes(
    api: ApiGatewayV1Api<{ redemptionsAuthorizer: ApiGatewayV1ApiAuthorizer }>,
    stack: Stack,
    routes: Record<string, ApiGatewayV1ApiRouteProps<'redemptionsAuthorizer'>>,
  ): void {
    api.addRoutes(stack, routes);
  }
}
