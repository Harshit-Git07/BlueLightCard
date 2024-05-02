import { ProfileRepository } from "src/repositories/profileRepository";

export interface IProfileService {
    isSpareEmail(uuid: string, email: string): Promise<boolean>;
}

export class ProfileService implements IProfileService{
    private profile: ProfileRepository;
  
    constructor(private readonly tableName: string, private readonly region: string) {
      this.profile = new ProfileRepository(tableName, region);
    }

  public async isSpareEmail(uuid: string, email: string) {
      const data = await this.profile.findByUuid(uuid);
      if(data && data.Items && data.Items.length > 0){
        return data.Items[0].spare_email === email;
      }
      return false;
  }
}