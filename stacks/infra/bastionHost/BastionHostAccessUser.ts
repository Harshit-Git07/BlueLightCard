import { SecretValue } from "aws-cdk-lib";
import { BastionHostLinux } from "aws-cdk-lib/aws-ec2";
import { AccessKey, PolicyStatement, User } from "aws-cdk-lib/aws-iam";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Stack } from "sst/constructs";

/**
 * Creates a user with access *only* to the database bastion host. This user can
 * be used to access the database in production if necessary. This user does not
 * have console access. The Access Key is stored in Secrets Manager, and rotated
 * on each deployment.
 * 
 * IMPORTANT: When accessing this user, handle the Access Key carefully.
 */
export class BastionHostAccessUser {
  constructor(
    private readonly stack: Stack,
    private readonly bastionHost: BastionHostLinux,
  ) {}

  public setup() {
    const user = this.createUser();
    this.createUserAccessKey(user);
    this.grantUserAccessToBastionHost(user);
  }

  private get userName() {
    return `${this.stack.stage}-RdmDbAccessUser`;
  }

  private createUser(): User {
    return new User(this.stack, this.userName, {
      userName: this.userName,
    });
  }

  private createUserAccessKey(user: User) {
    const accessKey = new AccessKey(this.stack, `${this.userName}-AccessKey`, {
      user,
      // Using the current timestamp as the serial ensures the Access Key is
      // rotated with every deployment.
      serial: Math.round(Date.now() / (1000 * 60)),
    });
    new Secret(this.stack, `SecretAccessKey-${this.userName}`, {
      secretName: `SecretAccessKey-${this.userName}`,
      secretStringValue: accessKey.secretAccessKey,
    });
    new Secret(this.stack, `AccessKeyId-${this.userName}`, {
      secretName: `AccessKeyId-${this.userName}`,
      // SAFETY: The Access Key ID does not grant access without the Secret
      //         Access Key.
      secretStringValue: SecretValue.unsafePlainText(accessKey.accessKeyId),
    });
  }

  private grantUserAccessToBastionHost(user: User) {
    const bastionHostArn = `arn:aws:ec2:${this.stack.region}:${this.stack.account}:instance/${this.bastionHost.instanceId}`;
    const startSessionCommandArn = `arn:aws:ssm:${this.stack.region}::document/AWS-StartPortForwardingSessionToRemoteHost`;
    const bastionHostAccessPolicyStatement = new PolicyStatement({
      actions: [
        'ssm:StartSession',
        'ssm:SendCommand',
        'ssm:TerminateSession',
        'ssm:DescribeSessions',
        'ssm:GetConnectionStatus',
        'ssm:DescribeInstanceInformation',
        'ssm:DescribeInstanceProperties',
      ],
      resources: [bastionHostArn, startSessionCommandArn],
    });
    user.addToPolicy(bastionHostAccessPolicyStatement);
  }
}
