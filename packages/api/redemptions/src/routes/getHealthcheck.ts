import {
    ApiGatewayModelGenerator,
    MethodResponses,
} from '../../../core/src/extensions/apiGatewayExtension';

export class GetHealthcheck {
  constructor(
    private apiGatewayModelGenerator: ApiGatewayModelGenerator, 
  ) { }

  getHealthcheck() {
    return {
      function: {
        handler: 'packages/api/redemptions/src/handlers/healthcheck/getHealthcheck.handler',
      },
      cdk: {
        method: {
          methodResponses: MethodResponses.toMethodResponses([
            this.apiGatewayModelGenerator.getError404(),
            this.apiGatewayModelGenerator.getError500(),
          ])
        },
      },
    };
  }
}