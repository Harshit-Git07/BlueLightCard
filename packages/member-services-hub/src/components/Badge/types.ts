import { ColourVariant } from '@/app/common/types/theme';
import { PropsWithChildren } from 'react';

export type BadgeProps = PropsWithChildren & {
  text: string;
  type: ColourVariant;
};
