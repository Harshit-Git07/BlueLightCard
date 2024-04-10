import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export interface IFirehoseStreamAdapter {
  getStreamName(): string;
  getPutRecordPolicyStatement(): PolicyStatement;
}
