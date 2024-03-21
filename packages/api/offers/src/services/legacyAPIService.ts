import axios, { AxiosResponse } from 'axios';
import { ENVIRONMENTS, LEGACY_API_BASE_URL, LegacyAPIEndPoints } from '../utils/global-constants';
import { Logger } from '@aws-lambda-powertools/logger';

interface ILegacyAPIService {
  stage: ENVIRONMENTS;
  token: string;
  logger: Logger;
}

export class LegacyAPIService {
  private stage: ENVIRONMENTS;
  private authToken: string;
  private logger: Logger;
  constructor({ stage, token, logger }: ILegacyAPIService) {
    this.stage = stage;
    this.authToken = token;
    this.logger = logger;
  }

  private getLegacyBaseURL(): string {
    this.logger.info({ message: 'getLegacyBaseURL', data: { stage: this.stage } });
    //returns URL
    let baseUrl;
    switch (this.stage) {
      case ENVIRONMENTS.PRODUCTION:
        baseUrl = LEGACY_API_BASE_URL.PRODUCTION;
        break;
      case ENVIRONMENTS.STAGING:
        baseUrl = LEGACY_API_BASE_URL.STAGING;
        break;
      default:
        baseUrl = LEGACY_API_BASE_URL.DEVELOPMENT;
        break;
    }
    return baseUrl;
  }

  get<T>(apiEndPoint: LegacyAPIEndPoints, queryParams: string, headers: Record<string, string> = {}) {
    //performs GET request
    const url = `${this.getLegacyBaseURL()}/${apiEndPoint}?${queryParams}&bypass=true`;
    this.logger.info({
      message: 'GET legacy api',
      data: { url },
    });
    return axios.get<AxiosResponse<T>>(url, {
      headers: {
        Authorization: this.authToken,
        ...headers,
      },
    });
  }
}
