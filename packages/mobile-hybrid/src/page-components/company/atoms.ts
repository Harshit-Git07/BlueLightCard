import { atom } from 'jotai';
import { CompanyModel, filtersType } from './types';

export const selectedFilter = atom<filtersType>('All');

export const companyDataAtom = atom<CompanyModel | undefined>(undefined);
