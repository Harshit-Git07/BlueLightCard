import { BadgeVariant } from '@/app/common/types/theme';
import { PropsWithChildren } from 'react';

export type BadgeProps = PropsWithChildren & {
  text: string;
  type: BadgeVariant;
};
