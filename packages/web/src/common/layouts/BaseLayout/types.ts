import { MetaDataProps } from '@/components/MetaData/types';
import type { ReactNode } from 'react';

export interface LayoutProps extends MetaDataProps {
  children: ReactNode;
}

export type PartialLayoutProps = Partial<LayoutProps>;
