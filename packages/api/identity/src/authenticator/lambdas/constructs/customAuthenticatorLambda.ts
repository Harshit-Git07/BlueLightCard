import { LambdaAbstract } from '../../../common/lambdaAbstract';
import { Stack } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class CustomAuthenticatorLambda extends LambdaAbstract {
  constructor(private stack: Stack, private stage: String) {
    super();
  }

  create(): NodejsFunction {
    const customAuthenticator = new NodejsFunction(this.stack, 'customAuthenticatorLambda', {
      entry: './packages/api/identity/src/authenticator/lambdas/constructs/customAuthenticatorLambdaHandler.ts',
      handler: 'handler',
      reservedConcurrentExecutions: 1,
      retryAttempts: 2,
      deadLetterQueueEnabled: true,
      environment: {},
    });

    return customAuthenticator;
  }

  protected grantPermissions(lambdaFunction: NodejsFunction): void {
    //nothing to do here
  }
}
