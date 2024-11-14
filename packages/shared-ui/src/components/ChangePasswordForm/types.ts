import {
  UpdatePasswordErrorApiResponse,
  UpdatePasswordSuccessApiResponse,
} from './useChangePasswordPut';

export type InputElementState = {
  value: string;
  error?: string;
};

export type PasswordField = 'currentPassword' | 'newPassword' | 'newPasswordConfirm';

export type CurrentFormState = Record<PasswordField, InputElementState>;

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type UpdatePasswordSuccessResponse = Partial<UpdatePasswordSuccessApiResponse> & {
  type: 'success';
};

type UpdatePasswordErrorResponse = Partial<UpdatePasswordErrorApiResponse> & {
  type: 'error';
};

export type UpdatePasswordResponse = UpdatePasswordSuccessResponse | UpdatePasswordErrorResponse;
