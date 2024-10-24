import { atom } from 'jotai';

export const initialiseAccordionAtom = () => {
  return {} as {
    [key: string]: string | undefined;
  };
};

export const accordionAtom = atom(initialiseAccordionAtom());
export type AccordionAtom = ReturnType<typeof initialiseAccordionAtom>;
