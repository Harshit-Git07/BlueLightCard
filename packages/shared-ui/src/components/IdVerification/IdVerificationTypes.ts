import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export enum IdVerificationMethod {
  WORK_EMAIL = 'WORK_EMAIL',
  NHS_SMART_CARD = 'NHS_SMART_CARD',
  PAYSLIP = 'PAYSLIP',
  WORK_ID_CARD = 'WORK_ID_CARD',
  WORK_CONTRACT = 'WORK_CONTRACT',
}

export interface IdVerificationAtom {
  isDoubleId: boolean;
  selectedMethod: IdVerificationMethod | null;
  memberUuid: string;
}

export interface IdVerificationDetail {
  title: string;
  description: string;
  detail?: string;
  tag?: {
    infoMessage: string;
    iconLeft: IconDefinition;
    state: 'Default' | 'Success' | 'Warning' | 'Error' | 'Info';
  };
}
