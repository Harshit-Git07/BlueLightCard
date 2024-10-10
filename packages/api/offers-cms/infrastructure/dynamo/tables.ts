import { type Stack, Table } from 'sst/constructs';

const OFFERS_RAW_DATA_TABLE_NAME = 'cmsOffersRawData';
const OFFERS_DATA_TABLE_NAME = 'cmsOffersData';
const COMPANY_RAW_DATA_TABLE_NAME = 'cmsCompanyRawData';
const COMPANY_DATA_TABLE_NAME = 'cmsCompanyData';

const createOffersRawDataTable = (stack: Stack) =>
  new Table(stack, OFFERS_RAW_DATA_TABLE_NAME, {
    fields: {
      _id: 'string',
      offerId: 'string',
    },
    primaryIndex: { partitionKey: '_id' },
    globalIndexes: {
      legacyId: {
        partitionKey: 'offerId',
      },
    },
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

const createCompanyRawDataTable = (stack: Stack) =>
  new Table(stack, COMPANY_RAW_DATA_TABLE_NAME, {
    fields: {
      _id: 'string',
    },
    primaryIndex: { partitionKey: '_id' },
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
  offersRawDataTable: createOffersRawDataTable(stack),
  offersDataTable: createOffersDataTable(stack),
  companyRawDataTable: createCompanyRawDataTable(stack),
  companyDataTable: createCompanyDataTable(stack),
});
