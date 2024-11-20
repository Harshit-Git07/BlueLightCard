import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import {
  CreateProfileModel,
  ProfileModel,
} from '@blc-mono/members/application/models/profileModel';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new ProfileService();

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<Record<string, string>> => {
  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const profile = CreateProfileModel.parse(JSON.parse(event.body));
  const memberId = await service.createProfile(profile);
  return { memberId };
};

export const handler = middleware(unwrappedHandler);
