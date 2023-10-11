/* eslint-disable react/jsx-key */
import { NextPage } from 'next';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import Button from '../identity/components/Button/Button';
import useBrandTranslation from '@/hooks/useBrandTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Heading from '@/components/Heading/Heading';
import AlertBox from '@/components/AlertBox/AlertBox';
import Link from 'next/link';

export const getStaticProps = getI18nStaticProps;

const Home: NextPage<any> = (props) => {
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

      <AlertBox
        alertType={'success'}
        title={'Success:'}
        description={
          <>
            This is success, with a <Link href="#">Link</Link>
          </>
        }
      />
      <AlertBox alertType={'danger'} title={'Danger:'} description={'This a danger test'} />
      <AlertBox alertType={'warning'} title={'Warning:'} description={'This a warning test'} />
      <AlertBox alertType={'info'} title={'Info:'} description={'This a info test'} />
    </>
  );
};

export default Home;
