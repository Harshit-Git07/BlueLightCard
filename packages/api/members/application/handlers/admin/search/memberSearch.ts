import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '../../../middleware';
import {
  MemberDocumentsSearchModel,
  MemberDocumentsSearchResponseModel,
} from '@blc-mono/members/application/models/memberDocument';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { MembersOpenSearchService } from './service/membersOpenSearchService';

const openSearchService = new MembersOpenSearchService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<MemberDocumentsSearchResponseModel> => {
  if (!event.body) throw new ValidationError('Missing request body');

  const filterParams = MemberDocumentsSearchModel.safeParse(JSON.parse(event.body));
  if (!filterParams.success) throw new ValidationError('Invalid request body');

  return await openSearchService.searchProfiles(filterParams.data);
};

export const handler = middleware(unwrappedHandler);
