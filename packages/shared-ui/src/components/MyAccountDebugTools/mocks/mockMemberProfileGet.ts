import { sleep } from '../../../utils/sleep';
import { ApplicationSchema, CardSchema, ProfileSchema } from '../../CardVerificationAlerts/types';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { Gender } from '@blc-mono/shared/models/members/enums/Gender';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';

export const mockCard: CardSchema = {
  expiryDate: '2024-11-27T08:55:46.030Z',
  nameOnCard: 'string',
  purchaseDate: '2023-11-27T08:55:46.030Z',
  cardNumber: '1234567890',
  cardStatus: CardStatus.AWAITING_BATCHING,
  paymentStatus: PaymentStatus.AWAITING_PAYMENT,
  memberId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  postedDate: '2024-11-27T08:55:46.030Z',
  batchNumber: 'string',
  createdDate: '',
};

export const mockApplication: ApplicationSchema = {
  applicationId: '12345678-1234-1234-12345678',
  applicationReason: ApplicationReason.LOST_CARD,
  memberId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
};

export const mockMemberProfileResponse: Required<ProfileSchema> = {
  firstName: 'Bat',
  lastName: 'Man',
  lastLogin: 'string',
  organisationId: '05e843e2-7967-4e40-b2af-8bf5a766ee60',
  gender: Gender.MALE,
  jobTitle: 'string',
  county: 'string',
  employmentStatus: EmploymentStatus.EMPLOYED,
  employerName: 'string',
  spareEmail: 'user@example.com',
  email: 'user@example.com',
  memberId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  signupDate: '2024-11-27T08:55:46.030Z',
  lastIpAddress: 'string',
  dateOfBirth: '2024-11-27',
  jobReference: 'string',
  employerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  phoneNumber: 'string',
  spareEmailValidated: false,
  emailValidated: false,
  gaKey: 'string',
  status: 'string',
  applications: [{ ...mockApplication }],
  companyNumber: '',
  cards: [{ ...mockCard }],
  documents: [],
  ingestionLastTriggered: '2024-11-27T08:55:46.030Z',
};

export const mockMemberProfileGetResponse = async () => {
  await sleep(500);
  return {
    status: 200,
    data: mockMemberProfileResponse,
  };
};
