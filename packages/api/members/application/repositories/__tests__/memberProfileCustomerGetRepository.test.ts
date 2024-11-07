import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { MemberProfileCustomerGetRepository } from '../memberProfileCustomerGetRepository';
import { CustomerProfileModel } from '../../models/customer/customerProfileModel';
import { EligibilityStatus } from '../../enums/EligibilityStatus';

const ddbMock = mockClient(DynamoDBDocumentClient);

const mockProfileData = {
  firstName: 'fname',
  lastName: 'lname',
  dateOfBirth: '1981-12-31',
  gender: 'gender',
  mobile: 'number',
  emailAddress: 'email',
  county: 'county',
  employmentType: 'type',
  organisationId: 'id',
  employerId: 'id',
  employerName: 'employerName',
  jobTitle: 'title',
  reference: 'ref',
};

const mockProfileParsed = {
  firstName: 'fname',
  lastName: 'lname',
  dateOfBirth: new Date('1981-12-31'),
  gender: 'gender',
  phoneNumber: 'number',
  emailAddress: 'email',
  county: 'county',
  employmentType: 'type',
  organisationId: 'id',
  employerId: 'id',
  employerName: 'employerName',
  jobTitle: 'title',
  reference: 'ref',
  card: null,
  applications: [],
};

const mockCardData1 = {
  cardCreated: '1624944422',
  expires: '1724944422',
  status: 'cardStatus',
  cardPaymentStatus: 'cardPayStatus',
};
const mockCardParsed1 = {
  cardNumber: '1234',
  cardCreated: new Date(1624944422),
  cardExpiry: new Date(1724944422),
  cardStatus: 'cardStatus',
  cardPaymentStatus: 'cardPayStatus',
};

const mockCardData2 = {
  cardCreated: '1626097583',
  expires: '1726097583',
  status: 'cardStatus',
  cardPaymentStatus: 'cardPayStatus',
};
const mockCardParsed2 = {
  cardNumber: '5678',
  cardCreated: new Date(1626097583),
  cardExpiry: new Date(1726097583),
  cardStatus: 'cardStatus',
  cardPaymentStatus: 'cardPayStatus',
};

const mockApplicationData1 = {
  startDate: '2025-12-31',
  eligibilityStatus: EligibilityStatus.AWAITING_ID_APPROVAL,
  applicationReason: 'reason',
  verificationMethod: 'verify',
  address1: 'add1',
  address2: 'add2',
  city: 'city',
  postCode: 'postCode',
  country: 'country',
  promoCode: 'promocode',
  trustedDomainEmail: 'email@email.com',
  trustedDomainVerified: true,
  rejectionReason: 'rejectionReason',
};
const mockApplicationParsed1 = {
  startDate: new Date('2025-12-31'),
  eligibilityStatus: EligibilityStatus.AWAITING_ID_APPROVAL,
  applicationReason: 'reason',
  verificationMethod: 'verify',
  address1: 'add1',
  address2: 'add2',
  city: 'city',
  postcode: 'postCode',
  country: 'country',
  promoCode: 'promocode',
  trustedDomainEmail: 'email@email.com',
  trustedDomainVerified: true,
  rejectionReason: 'rejectionReason',
};

describe('MemberProfileCustomerGetRepository', () => {
  let customerProfileRepo: MemberProfileCustomerGetRepository;
  const tableName = 'TestTable';

  beforeEach(() => {
    customerProfileRepo = new MemberProfileCustomerGetRepository(ddbMock as any, tableName);
    ddbMock.reset();
    jest.clearAllMocks();
  });

  it('should return customer profile with profile, card, and applications', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        { sk: 'PROFILE#1234', ...mockProfileData },
        { sk: 'CARD#1234', ...mockCardData1 },
        { sk: 'CARD#5678', ...mockCardData2 },
        { sk: 'APPLICATION#1234', ...mockApplicationData1 },
      ],
    });

    const result = await customerProfileRepo.getCustomerProfile({
      brand: 'BLC_UK',
      memberUuid: '123',
      profileUuid: '1234',
    });

    const expected: CustomerProfileModel = {
      ...mockProfileParsed,
      card: mockCardParsed2,
      applications: [mockApplicationParsed1],
    };

    expect(result).toEqual(expected);
  });

  it('should throw an error if profile data is missing', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        { sk: 'CARD#1234', ...mockCardData1 },
        { sk: 'APPLICATION#', ...mockApplicationData1 },
      ],
    });

    await expect(
      customerProfileRepo.getCustomerProfile({
        brand: 'BLC_UK',
        memberUuid: '123',
        profileUuid: '1234',
      }),
    ).rejects.toThrow('Member profile not found');
  });

  it('should return if card data is missing', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        { sk: 'PROFILE#', ...mockProfileData },
        { sk: 'APPLICATION#', ...mockApplicationData1 },
      ],
    });

    const result = await customerProfileRepo.getCustomerProfile({
      brand: 'BLC_UK',
      memberUuid: '123',
      profileUuid: '1234',
    });

    const expected: CustomerProfileModel = {
      ...mockProfileParsed,
      applications: [mockApplicationParsed1],
    };

    expect(result).toEqual(expected);
  });

  it('should return if no applications are present', async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        { sk: 'PROFILE#', ...mockProfileData },
        { sk: 'CARD#1234', ...mockCardData1 },
      ],
    });
    const result = await customerProfileRepo.getCustomerProfile({
      brand: 'BLC_UK',
      memberUuid: '123',
      profileUuid: '1234',
    });

    const expected: CustomerProfileModel = {
      ...mockProfileParsed,
      card: mockCardParsed1,
    };

    expect(result).toEqual(expected);
  });

  it('should throw an error if DynamoDB query fails', async () => {
    ddbMock.on(QueryCommand).rejects(new Error('DynamoDB error'));

    await expect(
      customerProfileRepo.getCustomerProfile({
        brand: 'BLC_UK',
        memberUuid: '123',
        profileUuid: '1234',
      }),
    ).rejects.toThrow('DynamoDB error');
  });
});
