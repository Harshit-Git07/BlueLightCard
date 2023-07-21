import { Dispatch, PropsWithChildren, SetStateAction } from 'react';

export type EligibilityCardProps = PropsWithChildren & {
  steps: number;
  formSubmitted: () => void;
  onNext: () => void;
  onSubmit: () => void;
  quit: () => void;

  //move to Jotai tbc
  employment: string;
  setEmployment: Dispatch<SetStateAction<string>>;
  organisation: string;
  setOrganisation: Dispatch<SetStateAction<string>>;
  employer: string;
  setEmployer: Dispatch<SetStateAction<string>>;
  jobRole: string;
  setJobRole: Dispatch<SetStateAction<string>>;
  orgDetails: any;
  setOrgDetails: Dispatch<SetStateAction<any>>;
  acceptedId: string;
  setAcceptedId: Dispatch<SetStateAction<string>>;
  employers: Employer[];
  setEmployers: Dispatch<SetStateAction<Employer[]>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  orgOptions: KeyValue[];
  setOrgOptions: Dispatch<SetStateAction<KeyValue[]>>;
  empOptions: KeyValue[];
  setEmpOptions: Dispatch<SetStateAction<KeyValue[]>>;
  acceptedMethods: IdRequirements[];
  setAcceptedMethods: Dispatch<SetStateAction<IdRequirements[]>>;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
};

export interface IOrganisation {
  id: number;
  name: string;
  idRequirements: Array<IdRequirements>;
}

export type IdRequirements = {
  description: string;
  id: string;
  title: string;
  criteria: Array<string>;
  allowedFormats: string;
};

export interface IOrganisationList {
  organisations: IOrganisation[];
}

export type Employer = {
  id: number;
  name: string;
};

export type KeyValue = {
  key: string | number;
  value: string;
  data?: any;
};
