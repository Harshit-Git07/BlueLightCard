import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ProfileModel } from '@blc-mono/members/application/models/profileModel';

const service = new ProfileService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<ProfileModel[]> => {
  return await service.getProfiles();
};

export const handler = middleware(unwrappedHandler);
