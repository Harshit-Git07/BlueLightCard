// components/Layout.tsx
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
import { LayoutProps } from './types';
import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';

const BaseLayout: React.FC<LayoutProps> = ({ seo, children, translationNamespace }) => {
  // Converts brand codes to text using the brand translation file
  // Uses data from locales folder as data source
  const authContext = useContext(AuthContext);
  const loggedIn = authContext.isUserAuthenticated();

  const { t: brandTranslator } = useBrandTranslation(
    translationNamespace
      ? ['common', 'description', translationNamespace]
      : ['common', 'description']
  );

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
          {seo.title && <title>{brandTranslator(seo.title, { ns: translationNamespace })}</title>}
          {seo.description && (
            <meta
              name="description"
              content={brandTranslator(seo.description, { ns: translationNamespace })}
            />
          )}
          {seo.keywords && (
            <meta
              name="keywords"
              content={brandTranslator(seo.keywords, { ns: translationNamespace })}
            />
          )}
          {seo.ogTitle && (
            <meta
              property="og:title"
              content={brandTranslator(seo.ogTitle, { ns: translationNamespace })}
            />
          )}
          {seo.ogType && (
            <meta
              property="og:title"
              content={brandTranslator(seo.ogType, { ns: translationNamespace })}
            />
          )}
          {seo.sitename && (
            <meta
              property="og:site_name"
              content={brandTranslator(seo.sitename, { ns: translationNamespace })}
            />
          )}
          {seo.ogUrl && (
            <meta
              property="og:url"
              content={brandTranslator(seo.ogUrl, { ns: translationNamespace })}
            />
          )}
          {seo.ogImage && (
            <meta
              property="og:image"
              content={brandTranslator(seo.ogImage, { ns: translationNamespace })}
            />
          )}

          {seo.twitterCard && (
            <meta
              name="twitter:card"
              content={brandTranslator(seo.twitterCard, { ns: translationNamespace })}
            />
          )}
          {seo.twitterTitle && (
            <meta
              name="twitter:title"
              content={brandTranslator(seo.twitterTitle, { ns: translationNamespace })}
            />
          )}
          {seo.twitterDescription && (
            <meta
              name="twitter:description"
              content={brandTranslator(seo.twitterDescription, { ns: translationNamespace })}
            />
          )}
          {seo.twitterImage && (
            <meta
              name="twitter:image"
              content={brandTranslator(seo.twitterImage, { ns: translationNamespace })}
            />
          )}
          {seo.twitterImageAlt && (
            <meta
              name="twitter:image:alt"
              content={brandTranslator(seo.twitterImageAlt, { ns: translationNamespace })}
            />
          )}
          {seo.twitterSite && (
            <meta
              name="twitter:site"
              content={brandTranslator(seo.twitterSite, { ns: translationNamespace })}
            />
          )}
          {seo.twitterCreator && (
            <meta
              name="twitter:creator"
              content={brandTranslator(seo.twitterCreator, { ns: translationNamespace })}
            />
          )}
        </Head>
      )}
      <Header
        navItems={navItems}
        loggedIn={loggedIn}
        onSearchCompanyChange={onSearchCompanyChange}
        onSearchCategoryChange={onSearchCategoryChange}
        onSearchTerm={onSearchTerm}
      />
      <div>{children}</div>
      <Footer {...footerConfig} loggedIn={loggedIn} />
    </div>
  );
};

export default BaseLayout;
