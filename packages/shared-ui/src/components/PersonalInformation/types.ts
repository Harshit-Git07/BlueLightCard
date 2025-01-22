import { ApiResponseError, ApiResponseSuccess } from '../../api/types';
import { UpdateProfileModel } from '@blc-mono/shared/models/members/profileModel';

export type UpdateCustomerProfilePayload = UpdateProfileModel;

type UpdateCustomerProfileSuccessResponse = Partial<ApiResponseSuccess> & {
  type: 'success';
};

type UpdateCustomerProfileErrorResponse = Partial<ApiResponseError> & {
  type: 'error';
};

export type UpdateCustomerProfileResponse =
  | UpdateCustomerProfileSuccessResponse
  | UpdateCustomerProfileErrorResponse;
