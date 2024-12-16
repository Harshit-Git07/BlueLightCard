import { ApplicationSchema, ProfileSchema } from './types';

export const defaultApplication: ApplicationSchema = {
  applicationId: '',
  applicationReason: 'SIGNUP',
  memberId: 'test_id',
};
export const defaultProfile: ProfileSchema = {
  cards: [],
  email: '',
  memberId: '',
  dateOfBirth: '',
  emailValidated: false,
  firstName: '',
  lastName: '',
  spareEmailValidated: false,
  applications: [],
};
