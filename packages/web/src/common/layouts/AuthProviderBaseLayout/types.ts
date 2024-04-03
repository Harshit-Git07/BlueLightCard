import { SEOProps } from '@/components/MetaData/types';
import type { ReactNode } from 'react';

export interface LayoutProps {
  requireAuth?: boolean;
  seo?: SEOProps;
  props: any;
  children: ReactNode;
}
