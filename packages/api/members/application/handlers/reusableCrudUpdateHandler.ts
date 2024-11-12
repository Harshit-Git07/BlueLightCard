import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '../utils/restResponse/response';
import { APIErrorCode } from '../enums/APIErrorCode';
import { APIError } from '../models/APIError';
import { ReusableCrudService } from '../services/reusableCrudService';
import { NamedZodType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { ReusableCrudQueryPayload } from '../types/reusableCrudQueryPayload';
import { ReusableCrudQueryMapper } from '../utils/mappers/reusableCrudQueryMapper';

import * as reusableCrudPayloadTypes from '../types/reusableCrudPayloadTypes';
import * as reusableCrudPayloadModels from '../models/reusableCrudPayloadModels';
import { validateRequest } from '../utils/requestValidator';
import { ReusableCrudRepository } from '../repositories/reusableCrudRepository';
import { PromoCodesService } from '@blc-mono/members/application/services/promoCodesService';
import { PromoCodesRepository } from '@blc-mono/members/application/repositories/promoCodesRepository';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PromoCodeResponse } from '@blc-mono/members/application/types/promoCodeResponse';
import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { MemberProfileRepository } from '@blc-mono/members/application/repositories/memberProfileRepository';
import { MemberProfileService } from '@blc-mono/members/application/services/memberProfileService';
import { OrganisationsRepository } from '@blc-mono/members/application/repositories/organisationsRepository';
import { EmployersRepository } from '@blc-mono/members/application/repositories/employersRepository';

const service: string = process.env.SERVICE as string;
const entityName: string = process.env.ENTITY_NAME as string;
const lambdaLogger = new LambdaLogger({ serviceName: `${service}-update${entityName}` });
const logger = new Logger({ serviceName: `${service}-update${entityName}` });

const pkPrefix = process.env.PK_PREFIX as string;
const skPrefix = process.env.SK_PREFIX as string;
const pkQueryKey = process.env.PK_QUERY_KEY as string;
const skQueryKey = process.env.SK_QUERY_KEY as string;

const tableName = process.env.ENTITY_TABLE_NAME as string;
const memberProfilesTableName = process.env.MEMBER_PROFILES_TABLE_NAME as string;
const promoCodeTableName = process.env.PROMO_CODE_TABLE_NAME as string;
const dynamoDB = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-2' }),
);
const memberProfilesRepository = new MemberProfileRepository(dynamoDB, memberProfilesTableName);
const organisationsRepository = new OrganisationsRepository(dynamoDB, memberProfilesTableName);
const employersRepository = new EmployersRepository(dynamoDB, memberProfilesTableName);
const memberProfilesService = new MemberProfileService(
  memberProfilesRepository,
  organisationsRepository,
  employersRepository,
  logger,
);
const promoCodesRepository = new PromoCodesRepository(dynamoDB, promoCodeTableName);
const promoCodesService = new PromoCodesService(
  promoCodesRepository,
  lambdaLogger,
  memberProfilesService,
);

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
  try {
    type PayloadTypeName = keyof typeof reusableCrudPayloadTypes;
    const payloadTypeName = process.env.PAYLOAD_TYPE_NAME as PayloadTypeName;
    const payloadType = reusableCrudPayloadTypes[payloadTypeName];

    type PayloadModelName = keyof typeof reusableCrudPayloadModels;
    const payloadModelName = process.env.MODEL_NAME as PayloadModelName;
    const model: NamedZodType<any> = reusableCrudPayloadModels[payloadModelName];

    const crudRepository = new ReusableCrudRepository<
      NamedZodType<z.ZodEffects<z.ZodObject<any>>>,
      typeof payloadType
    >(dynamoDB, tableName, model, pkPrefix, skPrefix);

    const crudService = new ReusableCrudService<
      NamedZodType<z.ZodEffects<z.ZodObject<any>>>,
      typeof payloadType
    >(entityName, model, pkPrefix, skPrefix, logger, dynamoDB, tableName, crudRepository);

    const query: ReusableCrudQueryPayload = ReusableCrudQueryMapper.fromPathParameters(
      event.pathParameters,
      pkQueryKey,
      skQueryKey,
    );

    if ((!query.pk && query.pk.length == 0) || !query.sk || (query.sk && query.sk.length == 0)) {
      logger.error({ message: 'Missing required query parameters' });
      return Response.BadRequest({
        message: 'Error: Missing required query parameters',
        errors: [
          new APIError(
            APIErrorCode.MISSING_REQUIRED_PARAMETER,
            pkQueryKey,
            `${pkQueryKey} is required`,
          ),
          new APIError(
            APIErrorCode.MISSING_REQUIRED_PARAMETER,
            skQueryKey,
            `${skQueryKey} is required`,
          ),
        ],
      });
    }

    const errorSet: APIError[] = [];

    const validationResult = validateRequest(event, logger);

    if ('statusCode' in validationResult) {
      return Response.BadRequest({ message: validationResult.body });
    }

    const { body } = validationResult;

    let promoCodeResponse: PromoCodeResponse | undefined = undefined;
    const promoCodeErrorSet: APIError[] = [];
    if (body.promoCode) {
      promoCodeResponse = await promoCodesService.validatePromoCode(
        query.pk,
        validationResult.body.promoCode,
        promoCodeErrorSet,
      );
    }

    if (promoCodeErrorSet.length > 0) {
      return Response.BadRequest({
        message: 'Promo code is not valid',
        errors: promoCodeErrorSet,
      });
    }

    await crudService.upsert(query, body, event.httpMethod === 'POST', errorSet);

    if (errorSet.length > 0) {
      return Response.BadRequest({
        message: `Errors occurred while updating ${entityName}`,
        errors: errorSet,
      });
    } else {
      if (promoCodeResponse) {
        return Response.OK({
          message: `Promo code updated successfully`,
          data: promoCodeResponse,
        });
      } else {
        return Response.OK({
          message: `${entityName} updated successfully`,
        });
      }
    }
  } catch (error) {
    logger.error({ message: `Error updating ${entityName}`, error });

    if (error instanceof Error) {
      if ('code' in error && (error as any).code === 'ConditionalCheckFailedException') {
        return Response.NotFound({
          message: `${entityName} not found`,
          errors: [
            new APIError(
              APIErrorCode.RESOURCE_NOT_FOUND,
              entityName,
              `No matching ${entityName} found`,
            ),
          ],
        });
      } else {
        return Response.Error(error);
      }
    }

    return Response.Error(new Error(`Unknown error occurred while updating ${entityName}`));
  }
};
