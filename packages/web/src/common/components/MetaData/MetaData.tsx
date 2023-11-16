import useBrandTranslation from '@/hooks/useBrandTranslation';
import Head from 'next/head';
import React from 'react';
import { MetaDataProps } from './types';

const MetaData: React.FC<MetaDataProps> = ({ seo, translationNamespace }) => {
  const { t: brandTranslator } = useBrandTranslation(
    translationNamespace
      ? ['common', 'description', translationNamespace]
      : ['common', 'description']
  );

  return (
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
      {seo.ogDescription && (
        <meta
          property="og:description"
          content={brandTranslator(seo.ogDescription, { ns: translationNamespace })}
        />
      )}
      {seo.ogType && (
        <meta
          property="og:type"
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
  );
};

export default MetaData;
