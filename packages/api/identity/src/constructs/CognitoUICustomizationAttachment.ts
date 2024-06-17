import { Construct } from 'constructs';
import { CustomResource, Duration, RemovalPolicy } from 'aws-cdk-lib/core';
import * as s3_asset from 'aws-cdk-lib/aws-s3-assets';
import * as cr from 'aws-cdk-lib/custom-resources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as logs from 'aws-cdk-lib/aws-logs';
import { UpdateCognitoUiProperties } from '../cognito/customizeHostedUI';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export interface CognitoUICustomizationProps {
  userPool: cognito.IUserPool;
  userPoolClient: cognito.IUserPoolClient;
  logoPath: string;
  cssPath: string;
}

export class CognitoUICustomizationAttachment extends Construct {
  constructor(scope: Construct, id: string, props: CognitoUICustomizationProps) {
    super(scope, id);

    const eventFn = new NodejsFunction(this, `${id}-customizeHostedUIEvent`, {
      description: 'No op waiting for domain to come up',
      entry: './packages/api/identity/src/cognito/customizeHostedUI.ts',
      handler: 'eventHandler',
      runtime: Runtime.NODEJS_18_X,
    });
    const completeFn = new NodejsFunction(this, `${id}-customizeHostedUI`, {
      description: 'Update Cognito Hosted UI Style',
      entry: './packages/api/identity/src/cognito/customizeHostedUI.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_18_X,
    });

    const policy = new iam.PolicyStatement({
      actions: ['cognito-idp:SetUICustomization', 'cognito-idp:DescribeUserPool'],
      effect: iam.Effect.ALLOW,
      resources: [props.userPool.userPoolArn],
    });
    completeFn.addToRolePolicy(policy);

    // Note that the resource for DescribeUserPoolDomain needs to be "*" since we can't get an ARN for the cognitoDomain.
    completeFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['cognito-idp:DescribeUserPoolDomain'],
        effect: iam.Effect.ALLOW,
        resources: ['*'],
      }),
    );

    const cssFileAsset = new s3_asset.Asset(this, 'Css', {
      path: props.cssPath,
      readers: [completeFn],
    });
    const logoAsset = new s3_asset.Asset(this, 'Logo', {
      path: props.logoPath,
      readers: [completeFn],
    });

    const provider = new cr.Provider(this, 'CrProvider', {
      onEventHandler: eventFn,
      isCompleteHandler: completeFn,
      queryInterval: Duration.seconds(30),
      totalTimeout: Duration.hours(1),
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    const crProperties: UpdateCognitoUiProperties = {
      cssLocator: {
        bucketName: cssFileAsset.s3BucketName,
        objectKey: cssFileAsset.s3ObjectKey,
      },
      logoLocator: {
        bucketName: logoAsset.s3BucketName,
        objectKey: logoAsset.s3ObjectKey,
      },
      userPoolClientId: props.userPoolClient.userPoolClientId,
      userPoolId: props.userPool.userPoolId,
    };
    new CustomResource(this, 'CustomResource', {
      serviceToken: provider.serviceToken,
      removalPolicy: RemovalPolicy.DESTROY,
      properties: crProperties,
      resourceType: 'Custom::CognitoUiCustomization',
    });
  }
}
