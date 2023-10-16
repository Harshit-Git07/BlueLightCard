import axios from 'axios';

export class UserProfile {
  private readonly authHeader: string;

  constructor(authHeader: string) {
    this.authHeader = authHeader;
  }

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
