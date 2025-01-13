import { ApiResponseError, ApiResponseSuccess } from '../../api/types';
import { components } from '../../generated/MembersApi';

export type UpdateCustomerProfilePayload = components['schemas']['UpdateProfileModel'];

type UpdateCustomerProfileSuccessResponse = Partial<ApiResponseSuccess> & {
  type: 'success';
};

type UpdateCustomerProfileErrorResponse = Partial<ApiResponseError> & {
  type: 'error';
};

export type UpdateCustomerProfileResponse =
  | UpdateCustomerProfileSuccessResponse
  | UpdateCustomerProfileErrorResponse;
