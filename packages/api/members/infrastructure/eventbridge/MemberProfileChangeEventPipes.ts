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

export function createMemberProfileChangeEventPipes(
  stack: Stack,
  memberProfilesTable: Table,
  memberProfilesSeedSearchIndexTable: Table,
  memberProfilesChangeEventQueue: Queue,
) {
  createPipeToMemberProfilesChangeEventQueue(
    stack,
    'MemberProfilesTable',
    memberProfilesTable,
    memberProfilesChangeEventQueue,
  );
  createPipeToMemberProfilesChangeEventQueue(
    stack,
    'MemberProfilesSeedSearchIndexTable',
    memberProfilesSeedSearchIndexTable,
    memberProfilesChangeEventQueue,
  );

  return;
}

const createPipeToMemberProfilesChangeEventQueue = (
  stack: Stack,
  name: string,
  table: Table,
  queue: Queue,
) => {
  const allowSqsSendMessageStatement = {
    Effect: 'Allow',
    Action: 'sqs:SendMessage',
    Resource: queue.cdk.queue.queueArn,
  };
  const allowDynamoDbStreamStatement = {
    Effect: 'Allow',
    Action: [
      'dynamodb:DescribeStream',
      'dynamodb:GetRecords',
      'dynamodb:GetShardIterator',
      'dynamodb:ListStreams',
    ],
    Resource: table.cdk.table.tableStreamArn,
  };

  const pipeTargetRole = new CfnRole(stack, `${name}StreamEventPipeRole`, {
    assumeRolePolicyDocument,
    policies: [
      {
        policyName: `${name}EventPipePolicy`,
        policyDocument: {
          Version: '2012-10-17',
          Statement: [allowSqsSendMessageStatement, allowDynamoDbStreamStatement],
        },
      },
    ],
  });

  return new CfnPipe(stack, `${name}TableEventPipe`, {
    source: table.cdk.table.tableStreamArn ?? '',
    sourceParameters: {
      dynamoDbStreamParameters: {
        startingPosition: 'LATEST',
        batchSize: 1,
      },
    },
    target: queue.cdk.queue.queueArn,
    roleArn: pipeTargetRole.attrArn,
  });
};
