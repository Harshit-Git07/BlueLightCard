import { ReactNode } from 'react';
import { PausableTimer } from '../../utils/pausableTimer';

export enum ToastStatus {
  'Default' = 'Default',
  'Success' = 'Success',
  'Error' = 'Error',
  'Warning' = 'Warning',
  'Info' = 'Info',
}

export enum ToastPosition {
  'TopLeft' = 'TopLeft',
  'TopCenter' = 'TopCenter',
  'TopRight' = 'TopRight',
  'BottomLeft' = 'BottomLeft',
  'BottomCenter' = 'BottomCenter',
  'BottomRight' = 'BottomRight',
}

export interface ToastAtom {
  toast: null | ReactNode;
  timer?: PausableTimer;
  options: ToastOptions;
}

export interface ToastOptions {
  duration: number;
  position: ToastPosition;
}
