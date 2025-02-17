import { Bucket } from 'sst/node/bucket';

export const documentUploadBucket = (): string => Bucket.documentUploadBucket.bucketName;
export const batchFilesBucket = (): string => Bucket.batchFilesBucket.bucketName;
