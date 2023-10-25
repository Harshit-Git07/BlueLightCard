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
    private companyDislikesService: CompanyDislikes;
    private userProfileService: UserProfile;

    constructor(private readonly legacyUserId: string, private readonly authHeader: string, private logger: Logger) {
        this.logger.info('Fetching Member Profile')
        this.logger.info('legacyUserId inside profile service', { legacyUserId });
        this.logger.info('authHeader inside profile service', { authHeader });
        this.companyDislikesService = new CompanyDislikes(Number(legacyUserId), logger);
        this.userProfileService = new UserProfile(authHeader, logger);
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