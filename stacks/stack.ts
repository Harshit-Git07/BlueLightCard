import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { Config, EventBus, StackContext } from 'sst/constructs';
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2';
import { Network } from './infra/network';
import { DwhKenisisFirehoseStreams } from './infra/firehose/DwhKenisisFirehoseStreams';
import { BastionHost } from './infra/bastionHost/BastionHost';
import { isDev } from '@blc-mono/core/utils/checkEnvironment';
import { getEnv, getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { SharedStackEnvironmentKeys } from './infra/environment';

interface ICertificate {
  certificateArn?: string;
}

export function Shared({ stack, app }: StackContext) {

  /**
   * The deployment is held until the certificate is verified.
   * To verify the certificate a new CNAME Record must be added to CloudFlare.
   * The CNAME name and value must match what is defined in AWS ACM.
   * This only needs to be done once.
   */
  const { certificateArn }: ICertificate = !isDev(stack.stage)
    ? new Certificate(stack, 'Certificate', {
        domainName: '*.blcshine.io',
        validation: CertificateValidation.fromDns(),
      })
    : {};

  //common event bus
  const bus = new EventBus(stack, 'eventBus');

  // Output the event bus name in config, so it can be used in E2E tests.
  new Config.Parameter(stack, 'SHARED_EVENT_BUS_NAME', {
    value: bus.eventBusName
  });

  //waf
  const webACL = new CfnWebACL(stack, 'WebACL', {
    defaultAction: {
      allow: {},
    },
    scope: 'REGIONAL',
    visibilityConfig: {
      cloudWatchMetricsEnabled: true,
      metricName: 'waf',
      sampledRequestsEnabled: true,
    },
  });

  // Create VPC for production and staging
  // Shared between brands to avoid Elastic IP quota limits
  const network = new Network(stack);

  // Create DWH Kinesis Firehose Streams
  const dwhKenisisFirehoseStreams = new DwhKenisisFirehoseStreams(stack);

  /**
   * Bastion host is only allowed in production and staging.
   * It is not intended for use in development environments.
   * It is used to access Production and Staging database inside the VPC from the outside.
   */
  const bastionHost = new BastionHost(stack, network.vpc).setup();

  stack.addOutputs({
    EventBusName: bus.eventBusName,
    webACL: webACL.name,
    vpcId: network.vpc.vpcId,
    certificateArn,
  });
  return {
    bus,
    certificateArn,
    webACL,
    vpc: network.vpc,
    dwhKenisisFirehoseStreams,
    /**
     * @deprecated IMPORTANT: Please read the note in stacks/infra/bastionHost/adapter.ts
     */
    bastionHost,
  };
}
