import { EbsDeviceVolumeType, IVpc, Port } from 'aws-cdk-lib/aws-ec2';
import { PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Domain, EngineVersion, TLSSecurityPolicy } from 'aws-cdk-lib/aws-opensearchservice';
import { Stack } from 'sst/constructs';

import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { RemovalPolicy } from 'aws-cdk-lib';
import { memberStackConfiguration } from '@blc-mono/members/infrastructure/stacks/shared/config/config';

export async function getOpenSearchDomain(stack: Stack, vpc: IVpc): Promise<string> {
  if (isOwnOpenSearchDomainNeeded(stack.stage)) {
    return await buildDomain(stack, vpc);
  }

  const config = memberStackConfiguration(stack);
  return config.openSearchDomainEndpoint ?? '';
}

function isOwnOpenSearchDomainNeeded(stage: string): boolean {
  return isCreateNewMembersOpenSearchDomainTrue() || isStaging(stage) || isProduction(stage);
}

function isCreateNewMembersOpenSearchDomainTrue(): boolean {
  return process.env.MEMBERS_OPENSEARCH_CREATE_NEW_DOMAIN?.toLowerCase() === 'true';
}

async function buildDomain(stack: Stack, vpc: IVpc): Promise<string> {
  const domain = new Domain(stack, 'Domain', {
    domainName: buildDomainName(stack),
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
    vpc,
    vpcSubnets: [
      vpc.selectSubnets({
        availabilityZones: ['eu-west-2a', 'ap-southeast-2a'],
      }),
    ],
    removalPolicy:
      isProduction(stack.stage) || isStaging(stack.stage)
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

  return domain.domainEndpoint;
}

function buildDomainName(stack: Stack): string {
  return stack.region === 'ap-southeast-2'
    ? `${stack.stage}-aus-members`
    : `${stack.stage}-members`;
}
