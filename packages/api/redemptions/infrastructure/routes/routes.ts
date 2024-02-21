import { ApiGatewayV1Api, ApiGatewayV1ApiRouteProps, Stack } from 'sst/constructs';

export class Routes {
  addRoutes(
    api: ApiGatewayV1Api<{ Authorizer: { type: 'user_pools'; userPoolIds: string[] } }>,
    stack: Stack,
    routes: Record<string, ApiGatewayV1ApiRouteProps<'Authorizer'>>,
  ): void {
    api.addRoutes(stack, routes);
  }
}
