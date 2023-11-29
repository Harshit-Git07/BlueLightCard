import { Table } from 'sst/constructs'
import { Stack } from 'aws-cdk-lib'

/**
 *  This class creates all the tables for the Eligibility Checker
 *  @param stack - The stack to add the tables to
 */
export class Tables {
  ecFormOutputDataTable: Table;

  constructor (private stack: Stack) {
    this.ecFormOutputDataTable = this.createEcFormOutputDataTable();
  }

  private createEcFormOutputDataTable (): Table {
    return new Table(this.stack, 'ecFormOutputData', {
      fields: {
        pk: 'string',
        sk: 'string',
        dateTime: 'number',
        employer: 'string',
        employmentStatus: 'string',
        jobRole: 'string',
        organisation: 'string',
      },
      primaryIndex: {
        partitionKey: 'pk',
        sortKey: 'sk'
      }
    })
  }
}
