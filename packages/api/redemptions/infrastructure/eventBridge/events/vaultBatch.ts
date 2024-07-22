export const UPLOAD_FILE_TYPE = '.csv';

export enum RedemptionsVaultBatchEvents {
  UPLOAD_SOURCE = 'aws.s3',
  UPLOAD_DETAIL_TYPE = 'Object Created',
  BATCH_CREATED = 'vaultBatchCreatedAdminEmail',
  BATCH_CREATED_DETAIL = 'vaultBatchCreatedAdminEmail.detail',
}
