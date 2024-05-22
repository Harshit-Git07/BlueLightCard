import { LambdaAbstract } from "./lambdaAbstract";
import { Duration, Stack } from "aws-cdk-lib";
import { Tables } from "../tables";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Buckets } from "../buckets";
import { Queues } from "../queues";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class S3MenusBucketEventQueueListenerLambda extends LambdaAbstract {
  constructor(private stack: Stack, private tables: Tables, private buckets: Buckets, private queues: Queues) {
    super();
  }

  create(): NodejsFunction {
    const s3BucketListener = new NodejsFunction(this.stack, 'S3MenusBucketEventQueueListenerLambda', {
      entry: './packages/api/offers/src/lambdaFunctions/s3MenusBucketEventQueueListenerLambdaHandler.ts',
      handler: 'handler',
      timeout: Duration.seconds(10),
      reservedConcurrentExecutions: 1,
      retryAttempts: 2,
      deadLetterQueueEnabled: true,
      environment: {
        OFFER_HOMEPAGE_TABLE: this.tables.offerHomepageTable.tableName,
      },
    });
    this.grantPermissions(s3BucketListener);
    this.addEventSource(s3BucketListener);
    return s3BucketListener;
  }

  protected grantPermissions(lambdaFunction: NodejsFunction): void {
    this.tables.offerHomepageTable.cdk.table.grantReadWriteData(lambdaFunction);
    this.buckets.blcUKBucket.cdk.bucket.grantRead(lambdaFunction);
    this.buckets.blcAUSBucket.cdk.bucket.grantRead(lambdaFunction);
    this.buckets.ddsUKBucket.cdk.bucket.grantRead(lambdaFunction);
  }

  private addEventSource(lambdaFunction: NodejsFunction): void {
    lambdaFunction.addEventSource(new SqsEventSource(this.queues.s3MenusBucketEventQueue.cdk.queue, {
      enabled: true,
    }))
  }
}
