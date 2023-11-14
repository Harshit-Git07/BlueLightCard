import { describe, expect, test } from '@jest/globals';
import { CompanyHandler } from '../company/companyHandler';
import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

const CATEGORY_TABLE_NAME = 'Category';
const TAG_TABLE_NAME = 'Tag';
const COMPANY_TABLE_NAME = 'Company';
const COMPANY_BRAND_CONNECTION_TABLE = 'CompanyBrandConnection';
const COMPANY_CATEGORY_CONNECTION_TABLE = 'CompanyCategoryConnection';
const COMPANY_TAG_CONNECTION_TABLE = 'CompanyTagConnection';

process.env.CATEGORY_TABLE_NAME = CATEGORY_TABLE_NAME;
process.env.TAG_TABLE_NAME = TAG_TABLE_NAME;
process.env.COMPANY_TABLE_NAME = COMPANY_TABLE_NAME;
process.env.COMPANY_BRAND_CONNECTION_TABLE = COMPANY_BRAND_CONNECTION_TABLE;
process.env.COMPANY_CATEGORY_CONNECTION_TABLE = COMPANY_CATEGORY_CONNECTION_TABLE;
process.env.COMPANY_TAG_CONNECTION_TABLE = COMPANY_TAG_CONNECTION_TABLE;
process.env.SERVICE = 'offers';

describe('Company Create Event Handler', () => {
  let handler: CompanyHandler = new CompanyHandler();
  let dynamoMock: ReturnType<typeof mockClient>;

  beforeEach(() => {
    dynamoMock = mockClient(DynamoDBDocumentClient);
  });

  afterEach(() => {
    dynamoMock.restore();
  });

  test('should handle company creation event successfully, no tags exist in table', async () => {
    dynamoMock
      .on(QueryCommand, {
        TableName: CATEGORY_TABLE_NAME,
      })
      .resolves({ Count: 1, Items: [{ id: 'cat-id' }] })
      .on(QueryCommand, {
        TableName: TAG_TABLE_NAME,
      })
      .resolves({});
    dynamoMock.on(PutCommand).resolves({});
    dynamoMock.on(TransactWriteCommand).resolves({});
    await handler.handleCompanyCreate(createEvent);
    expect(dynamoMock.calls()).toHaveLength(6);
  });

  test('should handle company creation event successfully, with tags exists in table', async () => {
    dynamoMock
      .on(QueryCommand, {
        TableName: CATEGORY_TABLE_NAME,
      })
      .resolves({ Count: 1, Items: [{ id: 'cat-id' }] })
      .on(QueryCommand, {
        TableName: TAG_TABLE_NAME,
        ExpressionAttributeValues: {
          ':name': createEvent.detail.tags[0],
        },
      })
      .resolves({ Count: 1, Items: [{ id: 'tag-id-1' }] })
      .on(QueryCommand, {
        TableName: TAG_TABLE_NAME,
        ExpressionAttributeValues: {
          ':name': createEvent.detail.tags[1],
        },
      })
      .resolves({ Count: 1, Items: [{ id: 'tag-id-2' }] });

    dynamoMock.on(TransactWriteCommand).resolves({});
    await handler.handleCompanyCreate(createEvent);
    expect(dynamoMock.calls()).toHaveLength(4);
  });

  test('should handle company creation event successfully, with combined existing and new tags', async () => {
    dynamoMock
      .on(QueryCommand, {
        TableName: CATEGORY_TABLE_NAME,
      })
      .resolves({ Count: 1, Items: [{ id: 'cat-id' }] })
      .on(QueryCommand, {
        TableName: TAG_TABLE_NAME,
        ExpressionAttributeValues: {
          ':name': createEvent.detail.tags[0],
        },
      })
      .resolves({ Count: 1, Items: [{ id: 'tag-id-1' }] })
      .on(QueryCommand, {
        TableName: TAG_TABLE_NAME,
        ExpressionAttributeValues: {
          ':name': createEvent.detail.tags[1],
        },
      })
      .resolves({});

    dynamoMock.on(PutCommand).resolves({});
    dynamoMock.on(TransactWriteCommand).resolves({});
    await handler.handleCompanyCreate(createEvent);
    expect(dynamoMock.calls()).toHaveLength(5);
  });

  test('should throw error when brand is invalid', async () => {
    const event = {
      source: 'company.create',
      detail: {
        brand: 'invalid-brand',
      },
    };
    await expect(handler.handleCompanyCreate(event)).rejects.toThrowError('Invalid brand: invalid-brand');
  });

  test('should throw error when brand is missing', async () => {
    const event = {
      source: 'company.create',
      detail: {},
    };
    await expect(handler.handleCompanyCreate(event)).rejects.toThrowError('Invalid brand: undefined');
  });

  test('should throw error when businessCatId is missing', async () => {
    const event = {
      source: 'company.create',
      detail: {
        brand: 'blc-uk',
        companyDetails: { ...companyDetails, isApproved: true, largeLogo: 'largeLogo', smallLogo: 'smallLogo' },
      },
    };
    await expect(handler.handleCompanyCreate(event)).rejects.toThrowError('Invalid businessCatId: undefined');
  });

  test('should throw error when businessCatId is wrong', async () => {
    await expect(handler.handleCompanyCreate(createEvent)).rejects.toThrowError(
      `Category not found for businessCatId: ${createEvent.detail.businessCatId}`,
    );
  });

  test('should throw error when companyDetails not have legacy id', async () => {
    const event = {
      source: 'company.create',
      detail: {
        brand: 'blc-uk',
        companyDetails: { ...companyDetails, legacyId: undefined },
      },
    };
    await expect(handler.handleCompanyCreate(event)).rejects.toThrowError('Invalid Data company legacyId is missing');
  });
});

describe('Company Update Event Handler', () => {
  let handler: CompanyHandler = new CompanyHandler();
  let dynamoMock: ReturnType<typeof mockClient>;

  beforeEach(() => {
    dynamoMock = mockClient(DynamoDBDocumentClient);
  });

  afterEach(() => {
    dynamoMock.restore();
  });

  test('should handle company update event successfully, tags and categories did not change', async () => {
    dynamoMock
      .on(QueryCommand, {
        TableName: COMPANY_TABLE_NAME,
      })
      .resolves({ Count: 1, Items: [{ id: 'company-id' }] })
      .on(QueryCommand, {
        TableName: CATEGORY_TABLE_NAME,
      })
      .resolves({ Count: 1, Items: [{ id: 'cat-id' }] })
      .on(GetCommand, {
        TableName: COMPANY_CATEGORY_CONNECTION_TABLE,
      })
      .resolves({ Item: { companyId: 'company-id', categoryId: 'cat-id' } })
      .on(QueryCommand, {
        TableName: TAG_TABLE_NAME,
        ExpressionAttributeValues: {
          ':name': createEvent.detail.tags[0],
        },
      })
      .resolves({ Count: 1, Items: [{ id: 'tag-id-1' }] })
      .on(QueryCommand, {
        TableName: TAG_TABLE_NAME,
        ExpressionAttributeValues: {
          ':name': createEvent.detail.tags[1],
        },
      })
      .resolves({ Count: 1, Items: [{ id: 'tag-id-2' }] })
      .on(QueryCommand, {
        TableName: COMPANY_TAG_CONNECTION_TABLE,
      })
      .resolves({ Count: 2, Items: [{ tagId: 'tag-id-1' }, { tagId: 'tag-id-2' }] });

    dynamoMock.on(PutCommand).resolves({});
    dynamoMock.on(TransactWriteCommand).resolves({});
    await handler.handleCompanyUpdate(updateEventTransactional);
    expect(dynamoMock.calls()).toHaveLength(8);
  });

  test('should handle company update event successfully, tags did not change', async () => {
    dynamoMock
      .on(QueryCommand, {
        TableName: COMPANY_TABLE_NAME,
      })
      .resolves({ Count: 1, Items: [{ id: 'company-id' }] })
      .on(QueryCommand, {
        TableName: CATEGORY_TABLE_NAME,
      })
      .resolves({ Count: 1, Items: [{ id: 'cat-id-2' }] })
      .on(GetCommand, {
        TableName: COMPANY_CATEGORY_CONNECTION_TABLE,
      })
      .resolves({})
      .on(QueryCommand, {
        TableName: COMPANY_CATEGORY_CONNECTION_TABLE,
      })
      .resolves({ Count: 1, Items: [{ companyId: 'company-id', categoryId: 'cat-id-2' }] })
      .on(QueryCommand, {
        TableName: TAG_TABLE_NAME,
        ExpressionAttributeValues: {
          ':name': createEvent.detail.tags[0],
        },
      })
      .resolves({ Count: 1, Items: [{ id: 'tag-id-1' }] })
      .on(QueryCommand, {
        TableName: TAG_TABLE_NAME,
        ExpressionAttributeValues: {
          ':name': createEvent.detail.tags[1],
        },
      })
      .resolves({ Count: 1, Items: [{ id: 'tag-id-2' }] })
      .on(QueryCommand, {
        TableName: COMPANY_TAG_CONNECTION_TABLE,
      })
      .resolves({ Count: 2, Items: [{ tagId: 'tag-id-1' }, { tagId: 'tag-id-2' }] });

    dynamoMock.on(PutCommand).resolves({});
    dynamoMock.on(TransactWriteCommand).resolves({});
    await handler.handleCompanyUpdate(updateEventTransactional);
    expect(dynamoMock.calls()).toHaveLength(9);
  });

  test('should handle company update event successfully, with new tags', async () => {
    dynamoMock
      .on(QueryCommand, {
        TableName: COMPANY_TABLE_NAME,
      })
      .resolves({ Count: 1, Items: [{ id: 'company-id' }] })
      .on(QueryCommand, {
        TableName: CATEGORY_TABLE_NAME,
      })
      .resolves({ Count: 1, Items: [{ id: 'cat-id-2' }] })
      .on(GetCommand, {
        TableName: COMPANY_CATEGORY_CONNECTION_TABLE,
      })
      .resolves({})
      .on(QueryCommand, {
        TableName: COMPANY_CATEGORY_CONNECTION_TABLE,
      })
      .resolves({ Count: 1, Items: [{ companyId: 'company-id', categoryId: 'cat-id-2' }] })
      .on(QueryCommand, {
        TableName: TAG_TABLE_NAME,
      })
      .resolves({})
      .on(QueryCommand, {
        TableName: COMPANY_TAG_CONNECTION_TABLE,
      })
      .resolves({});

    dynamoMock.on(PutCommand).resolves({});
    dynamoMock.on(TransactWriteCommand).resolves({});
    await handler.handleCompanyUpdate(updateEventTransactional);
    expect(dynamoMock.calls()).toHaveLength(11);
  });

  test('should throw error when company not exist', async () => {
    dynamoMock
      .on(QueryCommand, {
        TableName: COMPANY_TABLE_NAME,
      })
      .resolves({});
    await expect(handler.handleCompanyUpdate(updateEventTransactional)).rejects.toThrowError(
      `Company Update, Company not found ${updateEventTransactional.detail.brand}#${updateEventTransactional.detail.companyDetails.legacyId}`,
    );
  });

  test('should throw error when businessCatId not exist', async () => {
    const event = {
      source: 'company.update',
      detail: {
        brand,
        companyDetails,
      },
    };
    dynamoMock
      .on(QueryCommand, {
        TableName: COMPANY_TABLE_NAME,
      })
      .resolves({ Count: 1, Items: [{ id: 'company-id' }] });
    await expect(handler.handleCompanyUpdate(event)).rejects.toThrowError('Invalid businessCatId');
  });

  test('handle company update isApproved successfully', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 1, Items: [{ id: 'company-id' }] });
    dynamoMock.on(UpdateCommand).resolves({});
    await handler.handleCompanyUpdate(updateEventIsApproved);
    expect(dynamoMock.calls()).toHaveLength(2);
  });

  test('company update isApproved throws error when company not found', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 0, Items: [] });
    await expect(handler.handleCompanyUpdate(updateEventIsApproved)).rejects.toThrowError(
      `Company Update IsApproved, Company not found ${updateEventIsApproved.detail.brand}#${updateEventIsApproved.detail.IsApproved.legacyCompanyId}`,
    );
    expect(dynamoMock.calls()).toHaveLength(1);
  });

  test('handle company update smallLogo successfully', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 1, Items: [{ id: 'company-id' }] });
    dynamoMock.on(UpdateCommand).resolves({});
    await handler.handleCompanyUpdate(updateEventSmallLogo);
    expect(dynamoMock.calls()).toHaveLength(2);
  });

  test('company update smallLogo throws error when company not found', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 0, Items: [] });
    await expect(handler.handleCompanyUpdate(updateEventSmallLogo)).rejects.toThrowError(
      `Company Update Small Logo, Company not found ${updateEventSmallLogo.detail.brand}#${updateEventSmallLogo.detail.companySmallLogo.legacyCompanyId}`,
    );
    expect(dynamoMock.calls()).toHaveLength(1);
  });

  test('handle company update largeLogo successfully', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 1, Items: [{ id: 'company-id' }] });
    dynamoMock.on(UpdateCommand).resolves({});
    await handler.handleCompanyUpdate(updateEventLargeLogo);
    expect(dynamoMock.calls()).toHaveLength(2);
  });

  test('company update largeLogo throws error when company not found', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 0, Items: [] });
    await expect(handler.handleCompanyUpdate(updateEventLargeLogo)).rejects.toThrowError(
      `Company Update Large Logo, Company not found ${updateEventLargeLogo.detail.brand}#${updateEventLargeLogo.detail.companyLargeLogo.legacyCompanyId}`,
    );
    expect(dynamoMock.calls()).toHaveLength(1);
  });

  test('handle company update bothLogos successfully', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 1, Items: [{ id: 'company-id' }] });
    dynamoMock.on(UpdateCommand).resolves({});
    await handler.handleCompanyUpdate(updateEventBothLogos);
    expect(dynamoMock.calls()).toHaveLength(2);
  });

  test('company update bothLogos throws error when company not found', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 0, Items: [] });
    await expect(handler.handleCompanyUpdate(updateEventBothLogos)).rejects.toThrowError(
      `Company Update Both Logos, Company not found ${updateEventBothLogos.detail.brand}#${updateEventBothLogos.detail.companyBothLogos.legacyCompanyId}`,
    );
    expect(dynamoMock.calls()).toHaveLength(1);
  });
});

const companyDetails = {
  legacyId: 31800,
  name: 'New company',
  email: 'lukejohnson@bluelightcard.co.uk',
  phone: '01162313215',
  contactName: 'Luke Johnson',
  contactPosition: 'Boss',
  description: 'New company description',
  url: 'https://www.bluelightcard.co.uk',
  tradeRegion: '',
  postCode: 'LE12 7JZ',
  maximumOfferCount: 1,
  building: '',
  street: '52 Gleve Close',
  county: '',
  townCity: 'Leicestershire',
  country: 'GB',
  eagleEyeId: 0,
  affiliateNetworkId: '17',
  affiliateMerchantId: '0',
  isAgeGated: false,
};

const tags = ['tag1', 'tag2'];
const businessCatId = 123;
const brand = 'blc-uk';

const createEvent = {
  source: 'company.create',
  detail: {
    tags,
    businessCatId,
    brand,
    companyDetails: { ...companyDetails, isApproved: true, largeLogo: 'largeLogo', smallLogo: 'smallLogo' },
  },
};

const updateEventTransactional = {
  source: 'company.update',
  detail: {
    tags,
    businessCatId,
    brand,
    companyDetails,
  },
};

const updateEventIsApproved = {
  source: 'company.update',
  detail: {
    brand,
    IsApproved: { legacyCompanyId: 123, isApproved: false },
  },
};

const updateEventSmallLogo = {
  source: 'company.update',
  detail: {
    brand,
    companySmallLogo: { legacyCompanyId: 123, smallLogo: 'smallLogo' },
  },
};

const updateEventLargeLogo = {
  source: 'company.update',
  detail: {
    brand,
    companyLargeLogo: { legacyCompanyId: 123, largeLogo: 'largeLogo' },
  },
};

const updateEventBothLogos = {
  source: 'company.update',
  detail: {
    brand,
    companyBothLogos: { legacyCompanyId: 123, smallLogo: 'smallLogo', largeLogo: 'largeLogo' },
  },
};
