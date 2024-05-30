import { RouteProps } from '../routeProps';
import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { Model, RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { OffersFunction } from 'src/constructs/sst/OffersFunction';
import {EnvironmentVariablesKeys, getBLCBaseUrlFromEnv, getBrandSpecificEnvVar} from 'src/utils/environment-variables';
import { generateConstructId } from '@blc-mono/core/utils/generateConstuctId';

export class CompanyRoutes {
  constructor(private readonly routeProps: RouteProps) {}
  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /company/{id}': this.get(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: new OffersFunction(this.routeProps.stack, generateConstructId('GetCompanyInfoHandler', this.routeProps.stack.stackName), {
        handler: 'packages/api/offers/src/routes/company/getCompanyInfoHandler.handler',
        environment: {
          [EnvironmentVariablesKeys.BASE_URL]: getBLCBaseUrlFromEnv(this.routeProps.stack.stage, this.routeProps.stack.stackName),
          [EnvironmentVariablesKeys.LEGACY_OFFERS_API_ENDPOINT]:
            process.env[getBrandSpecificEnvVar('LEGACY_API_RETRIEVE_OFFERS_ENDPOINT', this.routeProps.stack.stackName)] as string,
        },
      }),
      cdk: {
        method: {
          requestModels: { 'application/json': this.routeProps.model as Model },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(this.routeProps.stack, generateConstructId('GetCompanyInfoValidator', this.routeProps.stack.stackName), {
            restApi: this.routeProps.api.cdk.restApi,
            validateRequestBody: false,
            validateRequestParameters: false,
          }),
        },
      },
    };
  }
}
