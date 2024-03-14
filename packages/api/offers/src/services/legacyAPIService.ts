import { ENVIRONMENTS, LEGACY_API_BASE_URL, LegacyAPIEndPoints } from '../utils/global-constants';

// TODO: TO-586 extend the functionality of this class to make API calls as well.
// Doing above would mean that value of stage will be passed from lambda code AKA this will not be triggered in CompanyRoutes.ts file
export class LegacyAPIService {
  public getURL(stage: ENVIRONMENTS, api: LegacyAPIEndPoints): string {
    let baseUrl;
    switch (stage) {
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
    return `${baseUrl}/${api}`;
  }
}
