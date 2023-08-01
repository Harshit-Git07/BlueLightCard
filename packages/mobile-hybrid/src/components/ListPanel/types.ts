import { PropsWithChildren } from 'react';

export type ListPanelProps = PropsWithChildren & {
  visible: boolean;
  onClose: () => void;
};
