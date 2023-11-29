import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

/**
 * This abstract class enforce the creation of a lambda function
 * And the granting of permissions to the lambda function
 */
export abstract class LambdaAbstract {
  abstract create(): NodejsFunction;
  protected abstract grantPermissions(lambdaFunction: NodejsFunction): void;
}
