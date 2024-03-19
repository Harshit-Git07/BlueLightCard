import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { ISpotifyService, SpotifyService } from '@blc-mono/redemptions/application/services/proxy/SpotifyService';
import { PostSpotifyModel } from '@blc-mono/redemptions/libs/models/postSpotify';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../ApiGatewayController';

const SpotifyRequestModel = z.object({
  body: JsonStringSchema.pipe(PostSpotifyModel),
});
type SpotifyRequestModel = z.infer<typeof SpotifyRequestModel>;
type ParsedRequest = SpotifyRequestModel;

export class SpotifyController extends APIGatewayController<SpotifyRequestModel> {
  static readonly inject = [Logger.key, SpotifyService.key] as const;

  constructor(protected readonly logger: ILogger, private readonly spotifyService: ISpotifyService) {
    super();
  }

  protected parseRequest(request: APIGatewayProxyEventV2): Result<ParsedRequest, ParseRequestError> {
    return this.zodParseRequest(request, SpotifyRequestModel);
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const { platform, companyId, offerId, memberId, url } = request.body;
    const result = await this.spotifyService.redeem(platform, companyId, offerId, memberId, url);

    switch (result.kind) {
      case 'CodeRedemedOk':
        return {
          statusCode: 200,
          data: {
            trackingUrl: result.data.trackingUrl,
            code: result.data.code,
          },
        };
      case 'AssignUserCodeOk':
        return {
          statusCode: 200,
          data: {
            trackingUrl: result.data.trackingUrl,
            code: result.data.code,
            dwh: result.data.dwh,
          },
        };
      default:
        exhaustiveCheck(result, 'Unhandled result kind');
    }
  }
}
