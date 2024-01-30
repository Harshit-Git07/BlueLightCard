import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { EventBus, StackContext } from 'sst/constructs';
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2';
import { Network } from './infra/network';

interface ICertificate {
  certificateArn?: string;
}

export function Shared({ stack }: StackContext) {
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

  stack.addOutputs({
    EventBusName: bus.eventBusName,
    webACL: webACL.name,
    vpcId: network.vpc.vpcId,
  });
  return {
    bus,
    certificateArn,
    webACL,
    vpc: network.vpc,
  };
}
