import axios from 'axios';
import { Logger } from "@aws-lambda-powertools/logger";

export class UserProfile {

  constructor(private readonly authHeader: string) {}

  async getUserProfileRequest() {
    const userDataConfig = {
      headers: {
        Authorization: this.authHeader,
      },
    };
    const userProfileEndpoint = (process.env.USER_PROFILE_ENDPOINT as string) ?? '';
    return axios.get(userProfileEndpoint, userDataConfig);
  }
}
