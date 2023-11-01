import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type CantEditButtonProps = {
  icon: IconDefinition;
  onClick: (modal: boolean) => void;
  open: boolean;
};
