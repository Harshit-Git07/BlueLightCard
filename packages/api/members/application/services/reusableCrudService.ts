import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { APIError } from '../models/APIError';
import { ReusableCrudRepository } from '../repositories/reusableCrudRepository';
import { NamedZodType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { ReusableCrudQueryPayload } from '../types/reusableCrudQueryPayload';
import { APIErrorCode } from '../enums/APIErrorCode';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class ReusableCrudService<
  TZodType extends NamedZodType<z.ZodEffects<z.ZodObject<any>>>,
  TPayload,
> {
  constructor(
    private readonly entityName: string,
    private readonly zodType: TZodType,
    private readonly pkPrefix: string,
    private readonly skPrefix: string,
    private readonly logger: Logger,
    dynamoDB: DynamoDBDocumentClient,
    tableName: string,
    private readonly repository: ReusableCrudRepository<TZodType, TPayload>,
  ) {}

  async get(query: ReusableCrudQueryPayload, errorList: APIError[]): Promise<TZodType[] | null> {
    return this.repository.get(query);
  }

  async upsert(
    query: ReusableCrudQueryPayload,
    payload: TPayload,
    isInsert: boolean,
    errorSet: APIError[],
  ): Promise<void> {
    let action: string = isInsert ? 'cre' : 'upd';
    try {
      this.zodType.parse({
        pk: `${this.pkPrefix}#${query.pk}`,
        sk: `${this.skPrefix}#${query.sk}`,
        ...payload,
      });

      await this.repository.upsert(query, payload, isInsert);
      this.logger.info({ message: `Successfully ${action}ated ${this.entityName}`, body: query });
    } catch (error) {
      this.logger.error({
        message: `Unknown error ${action}ating ${this.entityName}:`,
        error: JSON.stringify(error),
      });
      errorSet.push(
        new APIError(
          APIErrorCode.GENERIC_ERROR,
          'reusableCrudService.upsert',
          `Error occurred when ${action}ating ${this.entityName}`,
        ),
      );
      throw error;
    }
  }
}
