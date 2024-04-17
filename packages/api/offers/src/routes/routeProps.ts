import { ApiGatewayModelGenerator } from '../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1Api, Stack } from 'sst/constructs';
import { Model } from 'aws-cdk-lib/aws-apigateway';
import { IDatabaseAdapter } from '../constructs/database/IDatabaseAdapter';
import { Tables } from '../constructs/tables';

export type RouteProps = {
  stack: Stack;
  api: ApiGatewayV1Api;
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  model?: Model | Record<string, Model>;
  dbAdapter?: IDatabaseAdapter;
  dynamoTables?: Tables;
};
