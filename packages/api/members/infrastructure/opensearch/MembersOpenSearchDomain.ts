import { EbsDeviceVolumeType, IVpc, Port } from 'aws-cdk-lib/aws-ec2';
import { PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Domain, EngineVersion, TLSSecurityPolicy } from 'aws-cdk-lib/aws-opensearchservice';
import { Stack } from 'sst/constructs';

import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import {
  MemberStackConfigResolver,
  MemberStackRegion,
} from '@blc-mono/members/infrastructure/config/config';
import { RemovalPolicy } from 'aws-cdk-lib';

export class MembersOpenSearchDomain {
  constructor(
    private readonly stack: Stack,
    public readonly vpc: IVpc,
  ) {}

  public async setup(): Promise<string> {
    if (this.isOwnOpenSearchDomainNeeded(this.stack.stage)) {
      const openSearchDomain = await this.buildDomain();
      return openSearchDomain.domainEndpoint;
    } else {
      const config = MemberStackConfigResolver.for(
        this.stack,
        this.stack.region as MemberStackRegion,
      );
      return config.openSearchDomainEndpoint ?? '';
    }
  }

  private isOwnOpenSearchDomainNeeded(stage: string): boolean {
    return isCreateNewMembersOpenSearchDomainTrue() || isStaging(stage) || isProduction(stage);
  }

  private async buildDomain(): Promise<Domain> {
    const domain = new Domain(this.stack, 'membersDomain', {
      domainName: this.buildDomainName(),
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
        masterNodes: 0,
        dataNodes: 2,
        dataNodeInstanceType: 'r7g.medium.search',
      },
      vpc: this.vpc,
      removalPolicy:
        isProduction(this.stack.stage) || isStaging(this.stack.stage)
          ? RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE
          : RemovalPolicy.DESTROY,
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

  private buildDomainName(): string {
    return this.stack.region === 'ap-southeast-2'
      ? `${this.stack.stage}-aus-members`
      : `${this.stack.stage}-members`;
  }
}

function isCreateNewMembersOpenSearchDomainTrue(): boolean {
  return process.env.MEMBERS_OPENSEARCH_CREATE_NEW_DOMAIN?.toLowerCase() === 'true';
}
