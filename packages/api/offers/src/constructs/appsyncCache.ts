import { CfnApiCache, GraphqlApi } from "aws-cdk-lib/aws-appsync";
import { Duration, Stack } from "aws-cdk-lib";
import { isDev } from "../../../core/src/utils/checkEnvironment";

export class AppsyncCache {

  cfnApiCache: CfnApiCache | undefined;
  constructor(private stack: Stack, private stage: string, private api: GraphqlApi) {
    if (!isDev(this.stage)) {
      this.cfnApiCache = this.createApiCache();
    }
  }

  private createApiCache(): CfnApiCache {
    return  new CfnApiCache(this.stack, `${this.stage}-OffersApiCache`, {
      apiCachingBehavior: 'PER_RESOLVER_CACHING',
      type: 'LARGE',
      ttl: Duration.minutes(5).toSeconds(),
      apiId: this.api.apiId,
      atRestEncryptionEnabled: true,
      transitEncryptionEnabled: true,

    });
  }
}
