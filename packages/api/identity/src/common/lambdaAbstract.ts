import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

/**
 * This abstract class enforce the creation of a lambda function
 * And the granting of permissions to the lambda function
 */
export abstract class LambdaAbstract {
  constructor(nodeJsVersion: Runtime = Runtime.NODEJS_18_X) {
    this.lambdaRunTime = nodeJsVersion;
  }

  abstract create(): NodejsFunction;
  protected abstract grantPermissions(lambdaFunction: NodejsFunction): void;
  protected lambdaRunTime: Runtime;
}
