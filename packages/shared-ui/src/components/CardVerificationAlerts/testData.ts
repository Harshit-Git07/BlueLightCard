import { ApplicationSchema, ProfileSchema } from './types';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';

export const defaultApplication: ApplicationSchema = {
  applicationId: '',
  applicationReason: ApplicationReason.SIGNUP,
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
