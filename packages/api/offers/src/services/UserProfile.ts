import axios from 'axios';
import { Logger } from "@aws-lambda-powertools/logger";

export class UserProfile {

  constructor(private readonly authHeader: string, private logger: Logger) {
    this.logger.info('Fetching User Profile');
    this.logger.info('authHeader inside user profile service', { authHeader: this.authHeader });
  }

  async getUserProfileRequest() {
    const userDataConfig = {
      headers: {
        Authorization: this.authHeader,
      },
    };
    const userProfileEndpoint = (process.env.USER_PROFILE_ENDPOINT as string) ?? '';
    this.logger.info('authHeader inside user profile service before running axios', { authHeader: this.authHeader });
    return axios.get(userProfileEndpoint, userDataConfig);
  }
}
