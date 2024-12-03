import { CardProps } from '@bluelightcard/shared-ui/components/Card/types';

type CardButtonProps = Pick<
  CardProps,
  'showButton' | 'canHover' | 'initialCardState' | 'buttonTitle'
>;

export const interstitialCardWithButton: CardButtonProps = {
  showButton: true,
  canHover: true,
  initialCardState: 'selected',
  buttonTitle: 'Start',
};

export const interstitialCardWithoutButton: CardButtonProps = {
  showButton: false,
  canHover: false,
  initialCardState: 'default',
};
