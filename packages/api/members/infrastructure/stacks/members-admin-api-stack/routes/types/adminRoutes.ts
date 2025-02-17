import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';

export type AdminRoutes = Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>>;
