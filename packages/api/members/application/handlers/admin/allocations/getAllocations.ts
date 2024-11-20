import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ApprovalAllocationModel } from '@blc-mono/members/application/models/approvalAllocationModel';
import { App } from 'aws-cdk-lib';

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<ApprovalAllocationModel> => {
  return {
    applicationIds: ['1', '2'],
  };
};

export const handler = middleware(unwrappedHandler);
