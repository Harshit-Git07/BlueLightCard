import { NextPage } from 'next';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import Button from '../identity/components/Button/Button';
import useBrandTranslation from '@/hooks/useBrandTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Heading from '@/components/Heading/Heading';

export const getStaticProps = getI18nStaticProps;

const Home: NextPage<any> = () => {
  const { t } = useBrandTranslation(['common', 'description']);
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
      </Head>
      <main className="p-3">
        <div className="mt-1 p-5 bg-surface-brand rounded">
          <span className="text-shade-greyscale-white">Blue Light Card</span>
        </div>
        <Heading headingLevel={'h1'} className={''}>
          {t('heading')}
        </Heading>
        <hr />
        <p className="text-palette-body-text">{t('page.description', { ns: 'description' })}</p>
        <Button
          id="start_button"
          type="button"
          onClick={() => {
            router.push('/eligibility');
          }}
        >
          {t('button.text')}
        </Button>
      </main>
    </>
  );
};

export default Home;
