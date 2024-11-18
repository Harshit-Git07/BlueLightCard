import { PropsWithChildren } from 'react';

export interface AccordionProps extends PropsWithChildren {
  title: string;
  onClickOpen?: () => void;
}
