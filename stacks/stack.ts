import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { EventBus, StackContext } from 'sst/constructs';
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2';
import { Network } from './infra/network';
import { DwhKenisisFirehoseStreams } from './infra/firehose/DwhKenisisFirehoseStreams';
import { BastionHost } from './infra/bastionHost/BastionHost';

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
  const { certificateArn }: ICertificate = ['production', 'staging'].includes(stack.stage)
    ? new Certificate(stack, 'Certificate', {
        domainName: '*.blcshine.io',
        validation: CertificateValidation.fromDns(),
      })
    : {};

  //common event bus
  const bus = new EventBus(stack, 'eventBus');

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
    bastionHost,
  };
}
