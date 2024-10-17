import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDB } from 'aws-sdk';
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
import { ReusableCrudRepository } from '../repositories/reusableCrudRepository';

const service: string = process.env.SERVICE as string;
const entityName: string = process.env.ENTITY_NAME as string;
const logger = new Logger({ serviceName: `${service}-get${entityName}` });

const entityCollectionName = process.env.ENTITY_COLLECTION_NAME as string;

const pkPrefix = process.env.PK_PREFIX as string;
const skPrefix = process.env.SK_PREFIX as string;
const pkQueryKey = process.env.PK_QUERY_KEY as string;
const skQueryKey = process.env.SK_QUERY_KEY as string;

const tableName = process.env.ENTITY_TABLE_NAME as string;
const dynamoDB = new DynamoDB.DocumentClient({ region: process.env.REGION ?? 'eu-west-2' });

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  type PayloadTypeName = keyof typeof reusableCrudPayloadTypes;
  const payloadTypeName = process.env.PAYLOAD_TYPE_NAME as PayloadTypeName;
  const payloadType = reusableCrudPayloadTypes[payloadTypeName];

  type PayloadModelName = keyof typeof reusableCrudPayloadModels;
  const payloadModelName = process.env.MODEL_NAME as PayloadModelName;
  const model = reusableCrudPayloadModels[payloadModelName];

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

  if ((!query.pk && query.pk.length == 0) || (!query.brand && query.brand.length == 0)) {
    logger.error({ message: 'Missing required query parameters' });
    return Response.BadRequest({
      message: 'Error: Missing required query parameters',
      errors: [
        new APIError(
          APIErrorCode.MISSING_REQUIRED_PARAMETER,
          pkQueryKey,
          `${pkQueryKey} is required`,
        ),
        new APIError(APIErrorCode.MISSING_REQUIRED_PARAMETER, 'brand', 'brand is required'),
      ],
    });
  }

  try {
    const errorSet: APIError[] = [];
    const getResponse = await crudService.get(query, errorSet);

    if (errorSet.length > 0) {
      return Response.BadRequest({
        message: `Errors occurred while fetching ${entityName}`,
        errors: errorSet,
      });
    } else {
      if (getResponse && getResponse.length > 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            [entityCollectionName]: getResponse,
          }),
        };
      } else {
        return Response.NotFound({
          message: `No matching ${entityCollectionName} found`,
          errors: [
            new APIError(
              APIErrorCode.RESOURCE_NOT_FOUND,
              entityName,
              `No matching ${entityCollectionName} found`,
            ),
          ],
        });
      }
    }
  } catch (error) {
    logger.error({ message: `Error fetching ${entityName}`, error });
    if (error instanceof Error) {
      return Response.Error(error);
    } else {
      return Response.Error(new Error(`Unknown error occurred while fetching ${entityName}`));
    }
  }
};
