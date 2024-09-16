import { UserProfile } from 'src/models/userprofile';
import { IProfileRepository, ProfileRepository } from 'src/repositories/profileRepository';

export interface IProfileService {
  isSpareEmail(uuid: string, email: string): Promise<boolean>;
  getData(uuid: string): Promise<UserProfile | null>;
  getUuidByEmail(email: string): Promise<string>;
}

export class ProfileService implements IProfileService {
  public profile: IProfileRepository = new ProfileRepository();

  public async isSpareEmail(uuid: string, email: string) {
    const data = await this.profile.findByUuid(uuid);
    if (data?.Items && data.Items.length > 0) {
      return data.Items[0].spare_email === email;
    }
    return false;
  }

  public async getUuidByEmail(email: string) {
    const data = await this.profile.findByEmail(email);
    if (data?.Items && data.Items.length > 0) {
      return data.Items[0].pk.replace('MEMBER#', '');
    }
    return '';
  }

  public async getData(uuid: string): Promise<UserProfile> {
    const data = await this.profile.findByUuid(uuid);
    if (data?.Items && data.Items.length > 0) {
      return data.Items[0];
    }
    return {};
  }
}
