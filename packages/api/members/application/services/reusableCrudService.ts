import { Logger } from '@aws-lambda-powertools/logger';
import { APIError } from '../models/APIError';
import { ReusableCrudRepository } from '../repositories/reusableCrudRepository';
import { NamedZodType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { ReusableCrudQueryPayload } from '../types/reusableCrudQueryPayload';
import { APIErrorCode } from '../enums/APIErrorCode';

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
    dynamoDB: AWS.DynamoDB.DocumentClient,
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
      this.logger.info(`Successfully ${action}ated ${this.entityName}`, { query });
    } catch (error) {
      this.logger.error(`Unknown error ${action}ating ${this.entityName}:`, { error });
      errorSet.push(
        new APIError(
          APIErrorCode.GENERIC_ERROR,
          'reusableCrudService.upsert',
          'Error occurred when ${action}ating ${this.entityName}',
        ),
      );
      throw error;
    }
  }
}
