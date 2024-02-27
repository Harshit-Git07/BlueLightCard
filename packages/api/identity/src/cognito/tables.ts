import { Table } from 'sst/constructs'
import { Stack } from 'aws-cdk-lib'

/**
 *  This class creates all the tables to keep track of Cognito UI Unsuccessful Login attempts
 *  @param stack - The stack to add the tables to
 */
export class UnsuccessfulLoginAttemptsTables {
  table: Table;

  constructor (private stack: Stack) {
    this.table = this.createUnsuccessfulLoginAttemptsTable();
  }

  private createUnsuccessfulLoginAttemptsTable (): Table {
    return new Table(this.stack, 'identityUnsuccessfulLoginAttempts', {
      fields: {
        email: 'string',
        userPoolId: 'string',
        count: 'number',
        timestamp: 'number',
      },
      primaryIndex: {
        partitionKey: 'email',
        sortKey: 'userPoolId'
      },
      globalIndexes: {
        gsi1: {partitionKey: 'email', sortKey: 'userPoolId'},
      }
    })
  }
}
