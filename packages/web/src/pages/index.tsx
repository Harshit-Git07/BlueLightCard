import { NextPage } from 'next';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import Button from '../identity/components/Button/Button';
import useBrandTranslation from '@/hooks/useBrandTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';

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
        <h1 className="text-2xl mb-2 font-semibold">{t('heading')}</h1>
        <p>{t('page.description', { ns: 'description' })}</p>
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
