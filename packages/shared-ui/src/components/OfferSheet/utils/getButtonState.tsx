export enum ButtonStates {
  initial = 'initial',
  pressed = 'pressed',
  error = 'error',
}

type RedeemStatusType = 'idle' | 'pending' | 'success' | 'error';

export const getButtonState = (status: RedeemStatusType) => {
  return status === 'idle'
    ? ButtonStates.initial
    : status === 'pending' || status === 'success'
      ? ButtonStates.pressed
      : ButtonStates.error;
};
