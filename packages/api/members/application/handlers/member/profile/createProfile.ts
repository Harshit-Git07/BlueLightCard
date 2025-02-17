import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import {
  CreateProfileModel,
  CreateProfileModelResponse,
} from '@blc-mono/shared/models/members/profileModel';
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
