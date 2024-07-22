import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export interface IVaultCodesUploadAdapter {
  getBucketName(): string;
  getGetRecordPolicyStatement(): PolicyStatement;
}
