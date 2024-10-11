import { type Stack, Table } from 'sst/constructs';

const RAW_DATA_TABLE_NAME = 'cmsRawData';
const OFFERS_DATA_TABLE_NAME = 'cmsOffersData';
const COMPANY_DATA_TABLE_NAME = 'cmsCompanyData';

const createRawDataTable = (stack: Stack) =>
  new Table(stack, RAW_DATA_TABLE_NAME, {
    fields: {
      _id: 'string',
    },
    primaryIndex: { partitionKey: '_id' },
  });

const createOffersDataTable = (stack: Stack) =>
  new Table(stack, OFFERS_DATA_TABLE_NAME, {
    fields: {
      _id: 'string',
      offerId: 'string',
      companyId: 'string',
    },
    primaryIndex: { partitionKey: '_id' },
    globalIndexes: {
      legacyId: {
        partitionKey: 'offerId',
        sortKey: 'companyId',
      },
    },
  });

const createCompanyDataTable = (stack: Stack) =>
  new Table(stack, COMPANY_DATA_TABLE_NAME, {
    fields: {
      _id: 'string',
      companyId: 'string',
    },
    primaryIndex: { partitionKey: 'companyId' },
    globalIndexes: { cmsId: { partitionKey: '_id' } },
  });

export const createTables = (stack: Stack) => ({
  rawDataTable: createRawDataTable(stack),
  offersDataTable: createOffersDataTable(stack),
  companyDataTable: createCompanyDataTable(stack),
});
