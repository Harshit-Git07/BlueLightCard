import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import Button from '@/components/Button/Button';

export const getStaticProps = getI18nStaticProps;

const Home: NextPage<any> = () => {
  const { t } = useTranslation('common');
  return (
    <main className="p-3">
      <h1 className="text-2xl mb-2 font-semibold">{t('heading')}</h1>
      <Button>Button</Button>
    </main>
  );
};

export default Home;
