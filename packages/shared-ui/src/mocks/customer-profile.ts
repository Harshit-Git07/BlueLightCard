import type { CustomerProfileData } from '../types';

const customerProfileNoCardMock: CustomerProfileData = {
  firstName: 'Name',
  lastName: 'Last-name',
  dateOfBirth: '2024-12-12T00:00:00Z',
  phoneNumber: '+447239100223',
  emailAddres: 'email@test.co.uk',
  county: 'UK',
  employmentType: 'employment type',
  organisationId: 'organisation-id',
  employerId: 'employer-id',
  employerName: 'Test employer',
  jobtitle: 'Manager',
  reference: 'reference 123',
  card: {},
  applications: [],
};

const customerProfileCardNotGeneratedMock: CustomerProfileData = {
  firstName: 'Name',
  lastName: 'Last-name',
  dateOfBirth: '2024-12-12T00:00:00Z',
  phoneNumber: '+447239100223',
  emailAddres: 'email@test.co.uk',
  county: 'UK',
  employmentType: 'employment type',
  organisationId: 'organisation-id',
  employerId: 'employer-id',
  employerName: 'Test employer',
  jobtitle: 'Manager',
  reference: 'reference 123',
  card: {},
  applications: [
    {
      startDate: '2024-12-12T00:00:00Z',
      eligibilityStatus: 'ELIGIBLE',
      applicationReason: 'SIGNUP',
      verificationMethod: 'Email',
      address1: '123 Test Street',
      address2: 'Apt 4B',
      city: 'Testville',
      postcode: '12345',
      country: 'Testland',
      promoCode: 'promo 123',
      trustedDomainEmail: 'test.co.uk',
      trustedDomainVerified: true,
      rejectionReason: '',
    },
  ],
};

const customerProfileCardGeneratedMock: CustomerProfileData = {
  firstName: 'Name',
  lastName: 'Last-name',
  dateOfBirth: '2024-12-12T00:00:00Z',
  phoneNumber: '+447239100223',
  emailAddres: 'email@test.co.uk',
  county: 'UK',
  employmentType: 'employment type',
  organisationId: 'organisation-id',
  employerId: 'employer-id',
  employerName: 'Test employer',
  jobtitle: 'Manager',
  reference: 'reference 123',
  card: {
    cardNumber: 'BLC01234567',
    cardCreated: '2024-12-12T00:00:00Z',
    cardExpiry: '2024-12-12T00:00:00Z',
    cardStatus: 'PHYSICAL_CARD',
    cardPaymentStatus: 'PAID_CARD',
  },
  applications: [],
};

export {
  customerProfileNoCardMock,
  customerProfileCardNotGeneratedMock,
  customerProfileCardGeneratedMock,
};
