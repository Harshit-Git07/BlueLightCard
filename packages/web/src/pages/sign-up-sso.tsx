import { NextPage } from 'next';
import Navigation from '@/components/NavigationLegacy/Navigation';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import withAuthProviderLayout from '@/hoc/withAuthProviderLayout';
import requireAuth from '@/hoc/requireAuth';
import Footer from '../identity/components/Footer/Footer';

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
  footerOverride: (
    <Footer
      navItems={[
        { text: 'Terms & Conditions', link: '/terms_and_conditions.php' },
        { text: 'Privacy Policy', link: '/privacy-notice.php' },
        { text: 'Cookie Policy', link: '/cookies_policy.php' },
        { text: "FAQ's", link: '/contactblc.php' },
      ]}
      mobileBreakpoint={768}
    />
  ),
};

export default withAuthProviderLayout(requireAuth(SsoSignUpPage), layoutProps);
