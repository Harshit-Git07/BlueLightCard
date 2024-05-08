import { GetObjectCommand, ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import { Config } from 'sst/node/config';
import { z } from 'zod';

import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';
import { waitOn } from '@blc-mono/core/utils/waitOn';

import { tryParseConcatenatedJSON } from './tryParseConcatenatedJson';

const compViewSchema = z.object({
  cid: z.string(),
  oid_: z.number(),
  mid: z.string(),
  timedate: z.string(),
  type: z.number(),
  origin: z.string(),
});
type CompViewRecord = z.infer<typeof compViewSchema>;

const compClickSchema = z.object({
  company_id: z.string(),
  offer_id: z.number(),
  member_id: z.string(),
  timedate: z.string(),
  type: z.number(),
  origin: z.string(),
});
type CompClickRecord = z.infer<typeof compClickSchema>;

const vaultSchema = z.object({
  compid: z.string(),
  code: z.string(),
  uid: z.string(),
  whenrequested: z.string(),
  offer_id: z.string(),
});
type VaultRecord = z.infer<typeof vaultSchema>;

const logger = new CliLogger();

/**
 * In non-production environments, we set up dummy data warehouse firehose
 * streams to test our integration. This helper class provides utilities to
 * interact with the these dummy streams and their destinations.
 */
export class DwhTestHelper {
  constructor(private readonly s3Client: S3Client = new S3Client()) {}

  public findCompViewRecordByOfferId(offerId: number) {
    return this.findObjectInBucket(
      Config.DWH_BLC_PRODUCTION_COMPVIEW_DESTINATION_BUCKET,
      (object): object is CompViewRecord => compViewSchema.parse(object).oid_ === offerId,
    );
  }

  public findCompAppViewRecordByOfferId(offerId: number) {
    return this.findObjectInBucket(
      Config.DWH_BLC_PRODUCTION_COMPAPPVIEW_DESTINATION_BUCKET,
      (object): object is CompViewRecord => compViewSchema.parse(object).oid_ === offerId,
    );
  }

  public findCompClickRecordByOfferId(offerId: number) {
    return this.findObjectInBucket(
      Config.DWH_BLC_PRODUCTION_COMPCLICK_DESTINATION_BUCKET,
      (object): object is CompClickRecord => compClickSchema.parse(object).offer_id === offerId,
    );
  }

  public findCompAppClickRecordByOfferId(offerId: number) {
    return this.findObjectInBucket(
      Config.DWH_BLC_PRODUCTION_COMPAPPCLICK_DESTINATION_BUCKET,
      (object): object is CompClickRecord => compClickSchema.parse(object).offer_id === offerId,
    );
  }

  public findVaultRecordByOfferId(offerId: number) {
    return this.findObjectInBucket(
      Config.DWH_BLC_PRODUCTION_VAULT_DESTINATION_BUCKET,
      (object): object is VaultRecord => vaultSchema.parse(object).offer_id === offerId.toString(),
    );
  }

  private findObjectInBucket<T>(bucket: string, testObject: (object: unknown) => object is T): Promise<T> {
    return waitOn(
      {
        // Wait for a maximum of 30 seconds
        maxAttempts: 15,
        retryInterval: 2_000,
      },
      async () => {
        const objectKeys = await this.listObjectsInBucketFromToday(bucket);

        if (!objectKeys.length) {
          throw new Error('No recent objects found in bucket');
        }

        const objectBodies = await this.getObjectsJson(bucket, objectKeys);

        if (!objectBodies.length) {
          throw new Error('No objects found in bucket have a JSON object body');
        }

        function test(object: unknown): object is T {
          try {
            return testObject(object);
          } catch (error) {
            logger.error({
              message: 'Error testing object',
              context: {
                object,
              },
              error,
            });
            return false;
          }
        }

        const objectBody = objectBodies.find(test);

        if (!objectBody) {
          throw new Error('No objects found in bucket match the test');
        }

        return objectBody;
      },
    );
  }

  // ================================= Helpers =================================

  private async listObjectsInBucketFromToday(bucket: string) {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const Prefix = `${year}/${month}/${day}/`;

    const command = new ListObjectsCommand({
      Bucket: bucket,
      Prefix,
    });
    const response = await this.s3Client.send(command);

    return response.Contents?.map((content) => content.Key).filter(Boolean) ?? [];
  }

  private async getObjectsJson(bucket: string, keys: string[]) {
    const objectBodies = await Promise.all(
      keys.map(async (key) => {
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        });
        const response = await this.s3Client.send(command);
        if (!response.Body) {
          return;
        }
        const responseText = await response.Body.transformToString();

        // Firehose streams can concatenate multiple JSON objects together in a
        // single object. These are actually separated by a newline character.
        // However, for some reason when we read the object from S3, the newline
        // character is missing. I wasn't able to figure out why this is the case,
        // so this helper is used to parse concatenated JSON objects without a
        // newline separator.
        const records = tryParseConcatenatedJSON(responseText);

        return records;
      }),
    );

    return (
      objectBodies
        .flat()
        // Filter out any objects which did not have a body
        .filter(Boolean)
        // Filter out any errors that occurred while parsing the objects and log
        // them.
        .filter((object) => {
          if (object instanceof Error) {
            logger.error({
              message: 'Error parsing object',
              error: object,
            });
            return false;
          }
          return true;
        })
    );
  }
}
