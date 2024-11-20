import { Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1Api, Bucket, Stack, Table } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import {
  ApplicationModel,
  CreateApplicationModel,
  UpdateApplicationModel,
} from '@blc-mono/members/application/models/applicationModel';
import { DocumentUploadLocation } from '@blc-mono/members/application/models/documentUpload';

export function memberApplicationRoutes(
  stack: Stack,
  restApi: RestApi,
  apiGatewayModelGenerator: ApiGatewayModelGenerator,
  memberProfilesTable: Table,
  memberOrganisationsTable: Table,
  documentUploadBucket: Bucket,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  const defaultRouteParams = {
    stack,
    restApi,
    defaultAllowedOrigins: ['*'],
    apiGatewayModelGenerator,
    bind: [memberProfilesTable, memberOrganisationsTable, documentUploadBucket],
  };

  return {
    'POST /members/applications': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberCreateApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/createApplication.handler',
      requestModel: apiGatewayModelGenerator.generateModel(CreateApplicationModel),
    }),
    'PUT /members/applications': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberUpdateApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/updateApplication.handler',
      requestModel: apiGatewayModelGenerator.generateModel(UpdateApplicationModel),
    }),
    'GET /members/applications/{memberId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberGetApplications',
      handler:
        'packages/api/members/application/handlers/member/applications/getApplications.handler',
      responseModel: apiGatewayModelGenerator.generateModel(ApplicationModel),
    }),
    'GET /members/applications/{memberId}/{applicationId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberGetApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/getApplication.handler',
      responseModel: apiGatewayModelGenerator.generateModel(ApplicationModel),
    }),
    'GET /members/applications/{memberId}/{applicationId}/uploadDocument': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberUploadDocument',
      handler:
        'packages/api/members/application/handlers/member/applications/uploadDocument.handler',
      responseModel: apiGatewayModelGenerator.generateModel(DocumentUploadLocation),
    }),
  };
}
