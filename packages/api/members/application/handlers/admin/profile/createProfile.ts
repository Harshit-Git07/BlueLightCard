import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import {
  AdminCreateProfileModel,
  CreateProfileModelResponse,
} from '@blc-mono/shared/models/members/profileModel';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { Auth0ClientService } from '@blc-mono/members/application/services/auth0/auth0ClientService';

const service = new ProfileService();
const auth0Service = new Auth0ClientService();

const unwrappedHandler = async (
  event: APIGatewayProxyEvent,
): Promise<CreateProfileModelResponse> => {
  if (!event.body) {
    throw new ValidationError('Missing request body');
  }

  const profile = AdminCreateProfileModel.parse(JSON.parse(event.body));

  const memberId = await service.createProfile(profile);
  try {
    await auth0Service.createUser(memberId, profile);
  } catch (error) {
    // If auth0 fails for whatever reason we want to remove the newly created profile, just so we don't have any orphaned data
    await service.deleteProfile(memberId);
    throw error;
  }

  return CreateProfileModelResponse.parse({ memberId });
};

export const handler = middleware(unwrappedHandler);
