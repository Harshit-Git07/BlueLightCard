import { type Stack, Table } from 'sst/constructs';

const RAW_DATA_TABLE_NAME = 'cmsAll';
const OFFERS_DATA_TABLE_NAME = 'cmsOffer';
const EVENTS_DATA_TABLE_NAME = 'cmsEvent';
const COMPANY_DATA_TABLE_NAME = 'cmsCompany';

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
      companyId: {
        partitionKey: 'companyId',
      },
      legacyId: {
        partitionKey: 'offerId',
        sortKey: 'companyId',
      },
    },
  });

const createEventsDataTable = (stack: Stack) =>
  new Table(stack, EVENTS_DATA_TABLE_NAME, {
    fields: {
      _id: 'string',
      venueId: 'string',
    },
    primaryIndex: { partitionKey: '_id' },
    globalIndexes: {
      venueId: {
        partitionKey: 'venueId',
      },
    },
  });

const createCompanyDataTable = (stack: Stack) =>
  new Table(stack, COMPANY_DATA_TABLE_NAME, {
    fields: {
      _id: 'string',
      companyId: 'string',
    },
    primaryIndex: { partitionKey: '_id' },
    globalIndexes: { legacyId: { partitionKey: 'companyId' } },
  });

export const createTables = (stack: Stack) => ({
  rawDataTable: createRawDataTable(stack),
  offersDataTable: createOffersDataTable(stack),
  companyDataTable: createCompanyDataTable(stack),
  eventsDataTable: createEventsDataTable(stack),
});
