import { RouteProps } from '../routeProps';
import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { ENVIRONMENTS, LegacyAPIEndPoints } from 'src/utils/global-constants';
import { LegacyAPIService } from '../../services/legacyAPIService';

export class CompanyRoutes {
  private legacyAPIService: LegacyAPIService;
  constructor(private readonly routeProps: RouteProps) {
    this.legacyAPIService = new LegacyAPIService();
  }
  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /company/{id}': this.get(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: {
        handler: 'packages/api/offers/src/routes/company/getCompanyInfoHandler.handler',
        environment: {
          LEGACY_RETRIEVE_OFFERS_URL: this.legacyAPIService.getURL(
            this.routeProps.stack.stage as ENVIRONMENTS,
            LegacyAPIEndPoints.RETRIEVE_OFFERS,
          ),
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
}
