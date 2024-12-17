import { Stack } from 'aws-cdk-lib';
import { CfnRole } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { Queue, Table } from 'sst/constructs';

const assumeRolePolicyDocument = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Principal: {
        Service: 'pipes.amazonaws.com',
      },
      Action: 'sts:AssumeRole',
    },
  ],
};

export function createMemberProfilesPipe(
  stack: Stack,
  memberProfilesTable: Table,
  memberProfilesTableEventQueue: Queue,
): CfnPipe {
  const allowSqsSendMessageStatement = {
    Effect: 'Allow',
    Action: 'sqs:SendMessage',
    Resource: memberProfilesTableEventQueue.cdk.queue.queueArn,
  };
  const allowDynamoDbStreamStatement = {
    Effect: 'Allow',
    Action: [
      'dynamodb:DescribeStream',
      'dynamodb:GetRecords',
      'dynamodb:GetShardIterator',
      'dynamodb:ListStreams',
    ],
    Resource: memberProfilesTable.cdk.table.tableStreamArn,
  };

  const pipeTargetRole = new CfnRole(stack, 'MemberProfilesTableEventPipeRole', {
    assumeRolePolicyDocument,
    policies: [
      {
        policyName: 'MemberProfilesTableEventPipePolicy',
        policyDocument: {
          Version: '2012-10-17',
          Statement: [allowSqsSendMessageStatement, allowDynamoDbStreamStatement],
        },
      },
    ],
  });

  return new CfnPipe(stack, 'MemberProfilesTableEventPipe', {
    source: memberProfilesTable.cdk.table.tableStreamArn ?? '',
    sourceParameters: {
      dynamoDbStreamParameters: {
        startingPosition: 'LATEST',
        batchSize: 1,
      },
    },
    target: memberProfilesTableEventQueue.cdk.queue.queueArn,
    roleArn: pipeTargetRole.attrArn,
  });
}
