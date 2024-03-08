import { ApiGatewayModelGenerator } from '../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1Api, Stack } from 'sst/constructs';
import { Model } from 'aws-cdk-lib/aws-apigateway';
import { ISecurityGroup, IVpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseConfig } from '../database/type';

export type RouteProps = {
  stack: Stack;
  api: ApiGatewayV1Api;
  vpc?: IVpc;
  dbConfig?: DatabaseConfig;
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  model?: Model;
  securityGroups?: ISecurityGroup[] | undefined;
};
