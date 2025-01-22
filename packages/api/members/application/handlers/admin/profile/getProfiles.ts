import { middleware } from '../../../middleware';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';

const service = new ProfileService();

const unwrappedHandler = async (): Promise<ProfileModel[]> => {
  return await service.getProfiles();
};

export const handler = middleware(unwrappedHandler);
