import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DEFAULT_LANG, REGION } from '../global-vars';

const getI18nStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    region: REGION,
    ...(await serverSideTranslations(DEFAULT_LANG)),
  },
});

export default getI18nStaticProps;
