// components/Layout.tsx
import { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import {
  logSearchCompanyEvent,
  logSearchCategoryEvent,
  logSearchTermEvent,
} from '@/utils/amplitude';
import {
  getCompanyOfferDetailsUrl,
  getOffersByCategoryUrl,
  getOffersBySearchTermUrl,
} from '@/utils/externalPageUrls';

import { navItems } from '@/data/headerConfig';
import footerConfig from '@/data/footerConfig';
import Head from 'next/head';
import useBrandTranslation from '@/hooks/useBrandTranslation';

interface LayoutProps {
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
  children: ReactNode;
}

const BaseLayout: React.FC<LayoutProps> = ({ seo, children }) => {
  // Converts brand codes to text using the brand translation file
  // Uses data from locales folder as data source
  const { t: brandTranslator } = useBrandTranslation(['common', 'description']);

  const onSearchCompanyChange = async (companyId: string, company: string) => {
    await logSearchCompanyEvent(companyId, company);
    window.location.href = getCompanyOfferDetailsUrl(companyId);
  };

  const onSearchCategoryChange = async (categoryId: string, categoryName: string) => {
    await logSearchCategoryEvent(categoryId, categoryName);
    window.location.href = getOffersByCategoryUrl(categoryId);
  };

  const onSearchTerm = async (searchTerm: string) => {
    await logSearchTermEvent(searchTerm);
    window.location.href = getOffersBySearchTermUrl(searchTerm);
  };

  return (
    <div>
      {seo && (
        <Head>
          {seo.title && <title>{brandTranslator(seo.title)}</title>}
          {seo.description && (
            <meta name="description" content={brandTranslator(seo.description)} />
          )}
          {seo.keywords && <meta name="keywords" content={brandTranslator(seo.keywords)} />}
          {seo.ogTitle && <meta property="og:title" content={brandTranslator(seo.ogTitle)} />}
          {seo.ogType && <meta property="og:title" content={brandTranslator(seo.ogType)} />}
          {seo.sitename && <meta property="og:site_name" content={brandTranslator(seo.sitename)} />}
          {seo.ogUrl && <meta property="og:url" content={brandTranslator(seo.ogUrl)} />}
          {seo.ogImage && <meta property="og:image" content={brandTranslator(seo.ogImage)} />}

          {seo.twitterCard && (
            <meta name="twitter:card" content={brandTranslator(seo.twitterCard)} />
          )}
          {seo.twitterTitle && (
            <meta name="twitter:title" content={brandTranslator(seo.twitterTitle)} />
          )}
          {seo.twitterDescription && (
            <meta name="twitter:description" content={brandTranslator(seo.twitterDescription)} />
          )}
          {seo.twitterImage && (
            <meta name="twitter:image" content={brandTranslator(seo.twitterImage)} />
          )}
          {seo.twitterImageAlt && (
            <meta name="twitter:image:alt" content={brandTranslator(seo.twitterImageAlt)} />
          )}
          {seo.twitterSite && (
            <meta name="twitter:site" content={brandTranslator(seo.twitterSite)} />
          )}
          {seo.twitterCreator && (
            <meta name="twitter:creator" content={brandTranslator(seo.twitterCreator)} />
          )}
        </Head>
      )}
      <Header
        navItems={navItems}
        loggedIn={true}
        onSearchCompanyChange={onSearchCompanyChange}
        onSearchCategoryChange={onSearchCategoryChange}
        onSearchTerm={onSearchTerm}
      />
      <div>{children}</div>
      <Footer {...footerConfig} />
    </div>
  );
};

export default BaseLayout;
