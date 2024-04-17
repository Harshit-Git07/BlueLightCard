import { RouteProps } from '../../routeProps';
import { MethodResponses } from '../../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { Model, RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { EnvironmentVariablesKeys } from 'src/utils/environment-variables';

export class CompanyOfferRoutes {
  constructor(private readonly routeProps: RouteProps) {}
  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /company/{id}/offers': this.get(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    //configures API route
    return {
      function: {
        handler: 'packages/api/offers/src/routes/company/offers/getCompanyOffersHandler.handler',
        environment: {
          [EnvironmentVariablesKeys.STAGE]: this.routeProps.stack.stage,
          service: 'company offers',
        },
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.routeProps.model as Model },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(this.routeProps.stack, 'GetCompanyOffersValidator', {
            restApi: this.routeProps.api.cdk.restApi,
            validateRequestBody: false,
            validateRequestParameters: false,
          }),
        },
      },
    };
  }
}
