import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { EventBus, StackContext } from "sst/constructs";

interface ICertificate {
  certificateArn?: string
}

export function Shared({ stack }: StackContext) {
  /**
   * The deployment is held until the certificate is verified.
   * To verify the certificate a new CNAME Record must be added to CloudFlare.
   * The CNAME name and value must match what is defined in AWS ACM.
   * This only needs to be done once.
   */
  const { certificateArn }: ICertificate = ['production', 'staging'].includes(stack.stage) ?
    new Certificate(stack, 'Certificate', {
      domainName: '*.blcshine.io',
      validation: CertificateValidation.fromDns(),
    })
    : {};

  //common event bus
  const bus = new EventBus(stack, 'eventBus');
  
  stack.addOutputs({
    EventBusName: bus.eventBusName
  });

  return { 
    bus,
    certificateArn
  }
}