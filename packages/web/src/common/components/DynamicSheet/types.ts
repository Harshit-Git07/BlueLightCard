import React from 'react';

export type DynamicSheetProps = {
  children?: React.ReactNode | React.ReactNode[];
  showCloseButton?: boolean;
  onClose?: () => void;
  isOpen?: boolean;
  outsideClickClose?: boolean;
  containerClassName?: string;
  width?: string;
  height?: string;
};
