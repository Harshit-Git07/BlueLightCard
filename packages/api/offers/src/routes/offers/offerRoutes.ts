import { RouteProps } from '../routeProps';
import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { LEGACY_API_BASE_URL, LEGACY_RETRIEVE_OFFERS_URL } from 'src/utils/global-constants';
import { ENVIRONMENTS } from '../../utils/global-constants';
import { EnvironmentVariablesKeys } from 'src/utils/environment-variables';
import { isProduction } from '@blc-mono/core/utils/checkEnvironment';

export class OffersRoutes {
  constructor(private readonly routeProps: RouteProps) {}
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
          [EnvironmentVariablesKeys.STAGE]: this.routeProps.stack.stage,
          [EnvironmentVariablesKeys.FIREHOSE_STREAM_APP]: isProduction(this.routeProps.stack.stage)
            ? (process.env.FIREHOSE_STREAM_APP_VIEW_PROD!)
            : (process.env.FIREHOSE_STREAM_APP_VIEW_STAGE!),
          [EnvironmentVariablesKeys.FIREHOSE_STREAM_WEB]: isProduction(this.routeProps.stack.stage)
            ? (process.env.FIREHOSE_STREAM_WEB_VIEW_PROD!)
            : (process.env.FIREHOSE_STREAM_WEB_VIEW_STAGE!),
        },
        permissions: ['firehose:PutRecord'],
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.routeProps.model! },
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
    switch (stage) {
      case ENVIRONMENTS.PRODUCTION:
        return `${LEGACY_API_BASE_URL.PRODUCTION}/${LEGACY_RETRIEVE_OFFERS_URL}`;
      case ENVIRONMENTS.STAGING:
        return `${LEGACY_API_BASE_URL.STAGING}/${LEGACY_RETRIEVE_OFFERS_URL}`;
      // for local development replace this 'development' with your value of stage when legacy service is running locally on port 8080
      default:
        return `${LEGACY_API_BASE_URL.DEVELOPMENT}/${LEGACY_RETRIEVE_OFFERS_URL}`;
    }
  }
}
