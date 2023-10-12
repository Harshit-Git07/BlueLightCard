import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { LANGUAGE } from '../../../../global-vars';

const getI18nStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? LANGUAGE)),
  },
});

export default getI18nStaticProps;
