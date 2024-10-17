import { PropsWithChildren } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export enum TagState {
  Default = 'Default',
  Success = 'Success',
  Warning = 'Warning',
  Error = 'Error',
  Info = 'Info',
}

export type TagProps = PropsWithChildren & {
  state?: 'Default' | 'Success' | 'Warning' | 'Error' | 'Info';
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
  infoMessage?: string;
};
