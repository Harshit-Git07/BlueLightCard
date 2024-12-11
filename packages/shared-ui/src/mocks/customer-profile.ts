import { ProfileSchema } from '../components/CardVerificationAlerts/types';

const customerProfileNoCardMock: ProfileSchema = {
  memberId: 'testMemberId',
  firstName: 'Name',
  lastName: 'Last-name',
  dateOfBirth: '2024-12-12T00:00:00Z',
  phoneNumber: '+447239100223',
  email: 'email@test.co.uk',
  county: 'UK',
  organisationId: 'organisation-id',
  employerId: 'employer-id',
  employerName: 'Test employer',
  jobTitle: 'Manager',
  jobReference: 'reference 123',
  card: undefined,
  emailValidated: false,
  spareEmailValidated: false,
  applications: [],
};

const customerProfileCardNotGeneratedMock: ProfileSchema = {
  ...customerProfileNoCardMock,
  applications: [
    {
      applicationId: 'testApplicationId',
      memberId: 'testMemberId',
      startDate: '2024-12-12T00:00:00Z',
      eligibilityStatus: 'ELIGIBLE',
      applicationReason: 'SIGNUP',
      verificationMethod: 'Email',
      address1: '123 Test Street',
      address2: 'Apt 4B',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland',
      trustedDomainEmail: 'test.co.uk',
    },
  ],
};

const customerProfileCardGeneratedMock: ProfileSchema = {
  ...customerProfileNoCardMock,
  card: {
    memberId: 'test',
    cardNumber: 'BLC01234567',
    purchaseTime: '2024-12-12T00:00:00Z',
    expiryDate: '2024-12-12T00:00:00Z',
    cardStatus: 'PHYSICAL_CARD',
    paymentStatus: 'PAID_CARD',
  },
};

export {
  customerProfileNoCardMock,
  customerProfileCardNotGeneratedMock,
  customerProfileCardGeneratedMock,
};
