import { atom } from 'jotai';

export type UserProfile = {
  firstname?: string;
  surname?: string;
  organisation?: string;
  dob?: string;
  gender?: string;
  mobile?: string;
  uuid?: string;
  service?: string;
  isAgeGated?: boolean;
};
export const userProfile = atom<UserProfile | undefined>(undefined);
