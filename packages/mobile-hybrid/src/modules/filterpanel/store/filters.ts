import { atom } from 'jotai';

export const isFilterPanelOpenAtom = atom(false);
export const filters = atom<string[]>([]);
