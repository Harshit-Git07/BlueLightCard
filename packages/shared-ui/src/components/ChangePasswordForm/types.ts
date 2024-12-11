import { PasswordFields } from './constants';
import { ApiResponseError, ApiResponseSuccess } from '../../api/types';

export type InputElementState = {
  value: string;
  error?: string;
};

export type PasswordField = `${PasswordFields}`;

export type CurrentFormState = Record<PasswordField, InputElementState>;

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type UpdatePasswordSuccessResponse = Partial<ApiResponseSuccess> & {
  type: 'success';
};

type UpdatePasswordErrorResponse = Partial<ApiResponseError> & {
  type: 'error';
};

export type UpdatePasswordResponse = UpdatePasswordSuccessResponse | UpdatePasswordErrorResponse;
