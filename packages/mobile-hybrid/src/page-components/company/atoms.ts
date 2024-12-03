import { atom } from 'jotai';
import { CompanyModel, FiltersType } from './types';

export const selectedFilter = atom<FiltersType>('All');

export const companyDataAtom = atom<CompanyModel | undefined>(undefined);
