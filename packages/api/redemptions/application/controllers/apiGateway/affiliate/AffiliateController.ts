import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  APIGatewayController,
  APIGatewayResult,
  ParseRequestError,
} from '@blc-mono/redemptions/application/controllers/apiGateway/ApiGatewayController';
import {
  AffiliateHelper,
  AffiliateResultsKinds,
} from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import { PostAffiliateModel } from '@blc-mono/redemptions/libs/models/postAffiliate';

const GetAffiliateUrlRequest = z.object({
  headers: z.object({
    Authorization: z.string(),
  }),
  body: JsonStringSchema.pipe(PostAffiliateModel),
});
type ParsedRequest = z.infer<typeof GetAffiliateUrlRequest>;

export class AffiliateController extends APIGatewayController<ParsedRequest> {
  static readonly key = 'AffiliateController' as const;
  static readonly inject = [Logger.key] as const;

  constructor(logger: ILogger) {
    super(logger);
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    const parsedRequest = this.zodParseRequest(request, GetAffiliateUrlRequest);

    if (parsedRequest.isFailure) {
      return parsedRequest;
    }

    if (parsedRequest.isSuccess) {
      const parsedBearerToken = this.parseBearerToken(parsedRequest.value.headers.Authorization);
      if (parsedBearerToken.isFailure) {
        return parsedBearerToken;
      }
      return parsedRequest;
    }

    return parsedRequest;
  }

  public handle(request: ParsedRequest): APIGatewayResult {
    const { memberId, affiliateUrl, platform, companyId, offerId } = request.body;
    const affiliateConfig = AffiliateHelper.getTrackingUrl(memberId, affiliateUrl);

    switch (affiliateConfig.kind) {
      case AffiliateResultsKinds.OK:
        this.logger.info({
          message: 'Successful affiliate url request',
          context: {
            affiliateUrl,
            trackingUrl: affiliateConfig.data.url,
            platform,
            companyId,
            offerId,
          },
        });
        return {
          statusCode: 200,
          data: { message: 'Success', trackingUrl: affiliateConfig.data.url },
        };
      case AffiliateResultsKinds.NotSupportedAffiliate:
        this.logger.error({
          message: 'Affiliate not supported',
          context: { affiliateUrl, platform },
        });
        return {
          statusCode: 400,
          data: { message: 'Error while creating tracking URL (affiliate not supported)' },
        };
      case AffiliateResultsKinds.Error: {
        this.logger.error({
          message: 'Error while creating tracking URL',
          context: { affiliateUrl, platform },
        });
        return {
          statusCode: 500,
          data: { message: 'Error while creating tracking URL' },
        };
      }
      default:
        exhaustiveCheck(affiliateConfig, 'Unhandled affiliate config kind');
    }
  }
}
