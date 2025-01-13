import { PasswordFields } from './constants';
import { ApiResponseError, ApiResponseSuccess } from '../../api/types';
import { components } from '../../generated/MembersApi';

export type InputElementState = {
  value: string;
  error?: string;
};

export type PasswordField = `${PasswordFields}`;

export type CurrentFormState = {
  currentPassword: InputElementState;
  newPassword: InputElementState;
  newPasswordConfirm: InputElementState;
};

export type UpdatePasswordPayload = components['schemas']['PasswordChangeModel'];

type UpdatePasswordSuccessResponse = Partial<ApiResponseSuccess> & {
  type: 'success';
};

type UpdatePasswordErrorResponse = Partial<ApiResponseError> & {
  type: 'error';
};

export type UpdatePasswordResponse = UpdatePasswordSuccessResponse | UpdatePasswordErrorResponse;
