import { EbsDeviceVolumeType, IVpc, Port } from 'aws-cdk-lib/aws-ec2';
import { PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Domain, EngineVersion, TLSSecurityPolicy } from 'aws-cdk-lib/aws-opensearchservice';
import { Stack } from 'sst/constructs';

import { isCreateNewOpenSearchDomainTrue, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { DiscoveryStackConfigResolver, DiscoveryStackRegion } from '@blc-mono/discovery/infrastructure/config/config';

export class OpenSearchDomain {
  constructor(
    private readonly stack: Stack,
    public readonly vpc: IVpc,
  ) {}

  public async setup(): Promise<string> {
    if (this.isOwnOpenSearchDomainNeeded(this.stack.stage)) {
      const openSearchDomain = await this.buildDomain();
      return openSearchDomain.domainEndpoint;
    } else {
      const config = DiscoveryStackConfigResolver.for(this.stack, this.stack.region as DiscoveryStackRegion);
      return config.openSearchDomainEndpoint;
    }
  }

  private isOwnOpenSearchDomainNeeded(stage: string): boolean {
    // Add production check in here when feature is ready
    return isCreateNewOpenSearchDomainTrue() || isStaging(stage);
  }

  private async buildDomain(): Promise<Domain> {
    const domain = new Domain(this.stack, 'searchDomain', {
      domainName: `${this.stack.stage}-search`,
      version: EngineVersion.OPENSEARCH_2_9,
      ebs: {
        volumeSize: 10,
        volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
      },
      tlsSecurityPolicy: TLSSecurityPolicy.TLS_1_2,
      nodeToNodeEncryption: true,
      enforceHttps: true,
      encryptionAtRest: {
        enabled: true,
      },
      capacity: {
        masterNodes: 3,
        dataNodes: 3,
        dataNodeInstanceType: 'r6g.large.search',
        masterNodeInstanceType: 'm6g.large.search',
      },
      zoneAwareness: {
        enabled: true,
        availabilityZoneCount: 3,
      },
      vpc: this.vpc,
    });

    domain.addAccessPolicies(
      new PolicyStatement({
        principals: [new ServicePrincipal('lambda.amazonaws.com')],
        actions: ['es:*'],
        resources: [domain.domainArn + '/*'],
      }),
    );

    domain.connections.allowFromAnyIpv4(Port.tcp(443));

    return domain;
  }
}
