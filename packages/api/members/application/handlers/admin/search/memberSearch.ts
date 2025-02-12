import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import {
  MemberDocumentsSearchModel,
  MemberDocumentsSearchResponseModel,
} from '@blc-mono/shared/models/members/memberDocument';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { MembersOpenSearchService } from './service/membersOpenSearchService';
import { LambdaLogger } from '@blc-mono/core/utils/logger';

const openSearchService = new MembersOpenSearchService();

const logger = new LambdaLogger({ serviceName: 'MemberSearch' });

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<MemberDocumentsSearchResponseModel> => {
  const parsedFilterParams = MemberDocumentsSearchModel.safeParse(event.queryStringParameters);

  if (parsedFilterParams.error?.message)
    logger.error({ message: parsedFilterParams.error?.message });

  if (!parsedFilterParams.success) throw new ValidationError('Invalid query parameters');

  return await openSearchService.searchProfiles(parsedFilterParams.data);
};

export const handler = middleware(unwrappedHandler);
