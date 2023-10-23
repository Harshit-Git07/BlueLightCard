import type { ReactNode } from 'react';

export interface LayoutProps {
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogType?: string;
    sitename?: string;
    ogUrl?: string;
    ogImage?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    twitterImageAlt?: string;
    twitterSite?: string;
    twitterCreator?: string;
  };
  translationNamespace?: string;
  children: ReactNode;
}

export type PartialLayoutProps = Partial<LayoutProps>;
