import { RouteProps } from '../routeProps';
import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { EnvironmentVariablesKeys } from 'src/utils/environment-variables';
import { isProduction } from "@blc-mono/core/utils/checkEnvironment";

export class CompanyRoutes {
  constructor(private readonly routeProps: RouteProps) {}
  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /company/{id}': this.get(),
      'GET /recommendedCompanies': this.getRecommendedCompanies(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: {
        handler: 'packages/api/offers/src/routes/company/getCompanyInfoHandler.handler',
        environment: {
          [EnvironmentVariablesKeys.STAGE]: this.routeProps.stack.stage,
          service: 'company',
        },
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.routeProps.model! },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(this.routeProps.stack, 'GetCompanyInfoValidator', {
            restApi: this.routeProps.api.cdk.restApi,
            validateRequestBody: false,
            validateRequestParameters: false,
          }),
        },
      },
    };
  }

  private getRecommendedCompanies(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: {
        handler: 'packages/api/offers/src/routes/company/getRecommendedCompaniesHandler.handler',
        environment: {
          service: 'recommended_companies',
          tableName: isProduction(this.routeProps.stack.stage)
            ? 'production-blc-mono-recommended-companies'
            : 'staging-blc-mono-recommended-companies'
        },
        permissions: ['dynamodb:GetItem'],
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.routeProps.model! },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(this.routeProps.stack, 'GetRecommendedCompaniesValidator', {
            restApi: this.routeProps.api.cdk.restApi,
            validateRequestBody: false,
            validateRequestParameters: false,
          }),
        },
      },
    };
  }
}
