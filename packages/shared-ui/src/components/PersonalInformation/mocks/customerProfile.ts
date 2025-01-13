import { ProfileSchema } from '@/components/CardVerificationAlerts/types';

export const customerProfileNoCardMock: ProfileSchema = {
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
  emailValidated: false,
  spareEmailValidated: false,
  applications: [],
  cards: [],
  memberId: '',
};
