import { ApiGatewayModelGenerator } from '../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1Api, Stack } from 'sst/constructs';
import { Model } from 'aws-cdk-lib/aws-apigateway';
import { IDatabaseAdapter } from '../constructs/database/IDatabaseAdapter';

export type RouteProps = {
  stack: Stack;
  api: ApiGatewayV1Api;
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  model?: Model;
  dbAdapter?: IDatabaseAdapter;
};
