import { RouteProps } from '../routeProps';
import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { LEGACY_API_BASE_URL, LEGACY_RETRIEVE_OFFERS_URL } from 'src/utils/global-constants';
import { getEnvOrDefault } from '../../../../core/src/utils/getEnv';
import { Logger } from '@aws-lambda-powertools/logger';

export class OffersRoutes {
  constructor(private readonly routeProps: RouteProps) {}
  logger = new Logger({ serviceName: `route-offers-get` });
  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /offers/{id}': this.get(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: {
        handler: 'packages/api/offers/src/routes/offers/getOfferHandler.handler',
        environment: {
          LEGACY_RETRIEVE_OFFERS_URL: this.getLegacyOffersUrl(this.routeProps.stack.stage),
          service: 'offers',
        },
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.routeProps.model },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(this.routeProps.stack, 'GetOffersValidator', {
            restApi: this.routeProps.api.cdk.restApi,
            validateRequestBody: false,
            validateRequestParameters: false,
          }),
        },
      },
    };
  }

  private getLegacyOffersUrl(stage: string): string {
    this.logger.info({ message: 'getLegacyOffersUrl', data: { stage } });
    switch (stage) {
      case 'production':
        return `${LEGACY_API_BASE_URL.PRODUCTION}/${LEGACY_RETRIEVE_OFFERS_URL}`;
      case 'staging':
        return `${LEGACY_API_BASE_URL.STAGING}/${LEGACY_RETRIEVE_OFFERS_URL}`;
      // for local development replace this 'development' with your value of stage when legacy service is running locally on port 8080
      case 'rajats':
        return `${getEnvOrDefault('LEGACY_OFFERS_API_BASE_URL', 'localhost:8080')}/${LEGACY_RETRIEVE_OFFERS_URL}`;
      // for PR environments we don't have a dedicated URL for legacy service and a known mapping for users, so the case is not handled here
      default:
        return `${LEGACY_API_BASE_URL.PRODUCTION}/${LEGACY_RETRIEVE_OFFERS_URL}`;
    }
  }
}
