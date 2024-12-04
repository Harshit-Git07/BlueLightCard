import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { middleware } from '../../../middleware';
import {
  CreateProfileModel,
  CreateProfileModelResponse,
  ProfileModel,
} from '@blc-mono/members/application/models/profileModel';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';

const service = new ProfileService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<CreateProfileModelResponse> => {
  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const profile = CreateProfileModel.parse(JSON.parse(event.body));
  const memberId = await service.createProfile(profile);
  return CreateProfileModelResponse.parse({ memberId });
};

export const handler = middleware(unwrappedHandler);
