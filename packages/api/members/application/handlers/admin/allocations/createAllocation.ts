import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ApprovalAllocationModel } from '@blc-mono/members/application/models/approvalAllocationModel';

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<void> => {
  // TODO: Implement handler
};

export const handler = middleware(unwrappedHandler);
