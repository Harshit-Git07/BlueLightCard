import axios from 'axios';
import { Logger } from "@aws-lambda-powertools/logger";

export class CompanyDislikes {

  constructor(private readonly legacyUserId: number) {}

  async getDislikesRequest() {
    const LIKE_TYPE: number = 2;
    //dislike data from microservice
    const dislikesConfig = {
      headers: {
        Authorization: (process.env.COMPANY_FOLLOWS_SECRET as string) ?? '',
      },
    };
    const dislikesPostData = {
      userId: this.legacyUserId,
      brand: 'blc',
      likeType: LIKE_TYPE,
    };
    const dislikesEndpoint = (process.env.COMPANY_FOLLOWS_ENDPOINT as string) ?? '';
    return axios.post(dislikesEndpoint, dislikesPostData, dislikesConfig);
  }
}
