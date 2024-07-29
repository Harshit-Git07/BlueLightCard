import { Stack, ApiGatewayV1ApiAuthorizer, Function } from 'sst/constructs';

export interface SharedAuthorizer {
  functionArn: string;
  type: string;
  identitySources: string[];
}

export const ApiGatewayAuthorizer = (stack: Stack, id: string, authorizer: SharedAuthorizer) => {
  return {
    type: 'lambda_request',
    function: Function.fromFunctionArn(stack, id, authorizer.functionArn) as Function,
    identitySources: authorizer.identitySources,
  } as ApiGatewayV1ApiAuthorizer;
};
