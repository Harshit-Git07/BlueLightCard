import { atom } from 'jotai';
import { ToastPosition, ToastAtom } from './ToastTypes';

export const toastDefaultOptions = {
  duration: 7000,
  position: ToastPosition.TopLeft,
};

export const initializeToastAtom = (): ToastAtom => ({
  toast: null,
  timer: undefined,
  options: { ...toastDefaultOptions },
});

export const toastAtom = atom(initializeToastAtom());
