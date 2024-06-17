import { LambdaAbstract } from "../../../common/lambdaAbstract";
import { Stack } from "aws-cdk-lib";
import { EcFormOutputDataTable } from "../tables";
import { Buckets } from "../buckets";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

const sesPolicy = new iam.PolicyStatement({
  actions: ['ses:*'],
  resources: ['*'],
});

export class EcFormOutrputDataLambda extends LambdaAbstract {
  constructor(private stack: Stack, private tables: EcFormOutputDataTable, private buckets: Buckets, private stage: String) {
    super();
  }

  create(): NodejsFunction {
    const ecFormOutputData = new NodejsFunction(this.stack, 'EcFormOutputDataLambda', {
      entry: './packages/api/identity/src/eligibility/constructs/lambdas/ecFormOutrputDataLambdaHandler.ts',
      handler: 'handler',
      reservedConcurrentExecutions: 1,
      retryAttempts: 2,
      deadLetterQueueEnabled: true,
      environment: {
        EC_FORM_OUTPUT_DATA_TABLE: this.tables.table.tableName,
        S3_BUCKET_NAME: this.buckets.ecFormOutputBucket.bucketName,
		    EC_FORM_OUTPUT_DATA_REPORT_RECEIPIENTS: this.getEmailRecipients(),
        REGION: this.stack.region,
      },
      runtime: this.lambdaRunTime,
    });
    this.grantPermissions(ecFormOutputData);

    ecFormOutputData.role?.attachInlinePolicy (
      new iam.Policy(this.stack, 'ses-policy', {
        statements: [sesPolicy],
      }),
    );
    return ecFormOutputData;
  }

  private getEmailRecipients(): string {
	let identitySecret = undefined;
	if (this.stage === 'production') {
		identitySecret = Secret.fromSecretNameV2(this.stack,'ec-form-output-secret',`blc-mono-identity/production/secrets`);
	}
	return identitySecret !== undefined && identitySecret !== null ? identitySecret.secretValueFromJson('eligibility_checker_recipient_emails').toString(): '';
  }

  protected grantPermissions(lambdaFunction: NodejsFunction): void {
    this.tables.table.cdk.table.grantReadData(lambdaFunction);
    this.buckets.ecFormOutputBucket.cdk.bucket.grantReadWrite(lambdaFunction);
  }
}