import Container from '@/components/Container/Container';
import withLayout from '@/hoc/withLayout';
import useBrandTranslation from '@/hooks/useBrandTranslation';
import { PartialLayoutProps } from '@/layouts/BaseLayout/types';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import { NextPage } from 'next';

export const getStaticProps = getI18nStaticProps;

const layoutProps: PartialLayoutProps = {
  seo: {
    title: 'seo.title',
    description: 'seo.description',
    ogTitle: 'seo.og.title',
    ogType: 'seo.og.type',
    sitename: 'seo.og.sitename',
    ogUrl: 'seo.og.url',
    ogImage: 'seo.og.image',
    twitterCard: 'seo.twitter.card',
    twitterTitle: 'seo.twitter.title',
    twitterDescription: 'seo.twitter.description',
    twitterSite: 'seo.twitter.site',
    twitterImage: 'seo.twitter.image',
    twitterImageAlt: 'seo.twitter.imageAlt',
    twitterCreator: 'seo.twitter.creator',
  },
  translationNamespace: 'verify-page',
};

const VerifyPage: NextPage = () => {
  const { t } = useBrandTranslation('verify-page');

  return (
    <Container className="my-5">
      <h1>{t('intro')}</h1>
    </Container>
  );
};

export default withLayout(VerifyPage, layoutProps);
