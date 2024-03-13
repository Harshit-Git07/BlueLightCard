import { NextPage } from 'next';
import Navigation from '@/components/NavigationLegacy/Navigation';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';
import requireAuth from '@/hoc/requireAuth';

const SsoSignUpPage: NextPage = () => {
  return (
    <>
      <main className="bg-gray-50" />
    </>
  );
};

export const getStaticProps = getI18nStaticProps;

const layoutProps = {
  seo: {
    title: 'identity.seo.title',
    description: 'identity.seo.description',
  },
  headerOverride: <Navigation navItems={[]} showFlag={false} />,
};

export default withAuthProviderLayout(requireAuth(SsoSignUpPage), layoutProps);
