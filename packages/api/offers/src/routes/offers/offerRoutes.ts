import { RouteProps } from '../routeProps';
import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { ENVIRONMENTS, LegacyAPIEndPoints } from 'src/utils/global-constants';
import { EnvironmentVariablesKeys } from 'src/utils/environment-variables';
import { isProduction } from '@blc-mono/core/utils/checkEnvironment';
import { LegacyAPIService } from '../../services/legacyAPIService';

export class OffersRoutes {
  private legacyAPIService: LegacyAPIService;
  constructor(private readonly routeProps: RouteProps) {
    this.legacyAPIService = new LegacyAPIService();
  }
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
          LEGACY_RETRIEVE_OFFERS_URL: this.legacyAPIService.getURL(
            this.routeProps.stack.stage as ENVIRONMENTS,
            LegacyAPIEndPoints.RETRIEVE_OFFERS,
          ),
          service: 'offers',
          [EnvironmentVariablesKeys.STAGE]: this.routeProps.stack.stage,
          [EnvironmentVariablesKeys.FIREHOSE_STREAM_APP]: isProduction(this.routeProps.stack.stage)
            ? process.env.FIREHOSE_STREAM_APP_VIEW_PROD!
            : process.env.FIREHOSE_STREAM_APP_VIEW_STAGE!,
          [EnvironmentVariablesKeys.FIREHOSE_STREAM_WEB]: isProduction(this.routeProps.stack.stage)
            ? process.env.FIREHOSE_STREAM_WEB_VIEW_PROD!
            : process.env.FIREHOSE_STREAM_WEB_VIEW_STAGE!,
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
}
