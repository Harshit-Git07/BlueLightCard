import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { z } from 'zod';

import { JsonStringSchema } from '@blc-mono/core/schemas/common';
import { Result } from '@blc-mono/core/types/result';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { CallbackService, ICallbackService } from '@blc-mono/redemptions/application/services/callback/CallbackService';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { EagleEyeModel, PostCallbackModel, UniqodoModel } from '@blc-mono/redemptions/libs/models/postCallback';
import { ISecretsManager, SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

import { APIGatewayController, APIGatewayResult, ParseRequestError } from '../AdminApiGatewayController';

const IntegrationsSecretSchema = z.object({
  uniqodoApiKey: z.string(),
  eagleEyeApiKey: z.string(),
});

const CallbackRequestModel = z.object({
  body: JsonStringSchema.pipe(PostCallbackModel),
});

export type ParsedRequest = z.infer<typeof CallbackRequestModel>;

export class CallbackController extends APIGatewayController<ParsedRequest> {
  static readonly inject = [Logger.key, SecretsManager.key, CallbackService.key] as const;

  constructor(
    logger: ILogger,
    private readonly secretsManager: ISecretsManager,
    private readonly callbackService: ICallbackService,
  ) {
    super(logger);
  }

  protected async parseRequest(request: APIGatewayProxyEventV2): Promise<Result<ParsedRequest, ParseRequestError>> {
    const secrets = await this.secretsManager.getSecretValueJson(
      getEnv(RedemptionsStackEnvironmentKeys.INTEGRATION_PROVIDER_SECRETS_MANAGER_NAME),
    );
    const { uniqodoApiKey, eagleEyeApiKey } = IntegrationsSecretSchema.parse(secrets);

    const body = JSON.parse(request.body ?? '{}') as UniqodoModel | EagleEyeModel;

    let integrationType: 'uniqodo' | 'eagleeye';
    switch (request.headers['x-api-key']) {
      case uniqodoApiKey:
        integrationType = 'uniqodo';
        break;
      case eagleEyeApiKey:
        integrationType = 'eagleeye';
        break;
      default:
        throw new Error('Invalid API key');
    }
    const modifiedBody = {
      ...body,
      integrationType,
    };
    const modifiedRequest = {
      ...request,
      body: JSON.stringify(modifiedBody),
    };

    return this.zodParseRequest(modifiedRequest, CallbackRequestModel);
  }

  public async handle(request: ParsedRequest): Promise<APIGatewayResult> {
    const result = await this.callbackService.handle(request.body);
    switch (result.kind) {
      case 'NoContent':
        return {
          statusCode: 204,
        };
      case 'Error':
        return {
          statusCode: 500,
          data: {
            message: 'Internal server error',
          },
        };
      default:
        exhaustiveCheck(result.kind, 'Unhandled result kind');
    }
  }
}
