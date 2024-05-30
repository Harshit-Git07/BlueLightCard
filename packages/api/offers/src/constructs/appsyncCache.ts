import { CfnApiCache, GraphqlApi } from "aws-cdk-lib/aws-appsync";
import { Duration, Stack } from "aws-cdk-lib";
import { isDev } from "../../../core/src/utils/checkEnvironment";
import { generateConstructId } from '@blc-mono/core/utils/generateConstuctId';

export class AppsyncCache {

  cfnApiCache: CfnApiCache | undefined;
  constructor(private stack: Stack, private stage: string, private api: GraphqlApi) {
    if (!isDev(this.stage)) {
      this.cfnApiCache = this.createApiCache();
    }
  }

  private createApiCache(): CfnApiCache {
    return  new CfnApiCache(this.stack, generateConstructId(`${this.stage}-OffersApiCache`, this.stack.stackName), {
      apiCachingBehavior: 'PER_RESOLVER_CACHING',
      type: 'LARGE',
      ttl: Duration.minutes(5).toSeconds(),
      apiId: this.api.apiId,
      atRestEncryptionEnabled: true,
      transitEncryptionEnabled: true,

    });
  }
}
