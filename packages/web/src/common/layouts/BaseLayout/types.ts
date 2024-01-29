import { SEOProps } from '@/components/MetaData/types';
import type { ReactNode } from 'react';

export interface LayoutProps {
  seo?: SEOProps;
  children: ReactNode;
  translationNamespace?: string;
  headerOverride?: ReactNode;
}

export type PartialLayoutProps = Partial<LayoutProps>;
