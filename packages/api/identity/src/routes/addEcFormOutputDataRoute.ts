import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
  } from '../../../core/src/extensions/apiGatewayExtension';

  export class AddEcFormOutputDataRoute {
    constructor(private apiGatewayModelGenerator: ApiGatewayModelGenerator, private agEcFormOutputDataModel: Model) {}

    getRouteDetails() {
      return {
        function: {
          handler: 'packages/api/identity/src/eligibility/ecFormOutputData.handler',
        },
        cdk: {
          method: {
            apiKeyRequired: true,
            requestModels: { 'application/json': this.agEcFormOutputDataModel.getModel() },
            methodResponses: MethodResponses.toMethodResponses([
              new ResponseModel('200', this.agEcFormOutputDataModel),
              this.apiGatewayModelGenerator.getError400(),
            this.apiGatewayModelGenerator.getError404(),
            this.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    } as unknown as ApiGatewayV1ApiRouteProps<any>;
  }
}
