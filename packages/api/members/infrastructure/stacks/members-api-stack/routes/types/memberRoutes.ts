import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';

export type MemberRoutes = Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>>;
