import { SecurityGroup } from 'aws-cdk-lib/aws-ec2';

import { createMarkedType, InferMarkedType } from '@blc-mono/core/utils/typeMarkers';

// Marked types are used to prevent accidentally using the wrong security group in the wrong place.
const databaseIngressSecurityGroupMarker = Symbol('ingress');
export const DatabaseIngressSecurityGroup = createMarkedType<
  SecurityGroup,
  typeof databaseIngressSecurityGroupMarker
>();
export type DatabaseIngressSecurityGroup = InferMarkedType<typeof DatabaseIngressSecurityGroup>;

const databaseEgressSecurityGroupMarker = Symbol('egress');
export const DatabaseEgressSecurityGroup = createMarkedType<SecurityGroup, typeof databaseEgressSecurityGroupMarker>();
export type DatabaseEgressSecurityGroup = InferMarkedType<typeof DatabaseEgressSecurityGroup>;
