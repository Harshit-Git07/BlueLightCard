import { SEOProps } from '@/components/MetaData/types';
import type { ReactNode } from 'react';

export interface LayoutProps {
  seo?: SEOProps;
  children: ReactNode;
  translationNamespace?: string;
}

export type PartialLayoutProps = Partial<LayoutProps>;
