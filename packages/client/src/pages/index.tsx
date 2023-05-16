import { NextPage } from 'next';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import Button from '@/components/Button/Button';
import useBrandTranslation from '@/hooks/useBrandTranslation';

export const getStaticProps = getI18nStaticProps;

const Home: NextPage<any> = () => {
  const { t } = useBrandTranslation(['common', 'description']);
  return (
    <main className="p-3">
      <h1 className="text-2xl mb-2 font-semibold">{t('heading')}</h1>
      <p>{t('page.description', { ns: 'description' })}</p>
      <Button>{t('button.text')}</Button>
    </main>
  );
};

export default Home;
