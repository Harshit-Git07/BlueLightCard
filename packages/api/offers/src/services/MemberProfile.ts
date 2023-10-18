import { Logger } from '@aws-lambda-powertools/logger';
import { getAge } from '../../../core/src/utils/getAge';
import { CompanyDislikes } from './CompanyDislikes';
import { UserProfile } from './UserProfile';

interface UserProfileData {
    organisation: string;
    isUnder18: boolean;
    dislikedCompanyIds: number[];
}

export class MemberProfile {
    private readonly companyDislikesService: CompanyDislikes;
    private readonly userProfileService: UserProfile;

    constructor(legacyUserId: string, authHeader: string, private logger: Logger) {
        this.companyDislikesService = new CompanyDislikes(Number(legacyUserId));
        this.userProfileService = new UserProfile(authHeader);
    }

    async getProfile(): Promise<UserProfileData> {
        //user profile data for organisation and dob
        let organisation: string = '';
        let dislikedCompanyIds: number[] = [];
        let isUnder18: boolean = false;
    
        try {
          const [dislikeResponse, userProfileResponse] = await Promise.all([this.companyDislikesService.getDislikesRequest(), this.userProfileService.getUserProfileRequest()]);

          const dob = userProfileResponse.data.data.profile.dob;

          dislikedCompanyIds = dislikeResponse.data.data;
          organisation = userProfileResponse.data.data.profile.organisation;
          isUnder18 = getAge(dob); // calculate from dob

        } catch (e) {
          this.logger.error('Failed to invoke Members API service', { e });
        }

        return {
            organisation,
            isUnder18,
            dislikedCompanyIds
        }
    }
}