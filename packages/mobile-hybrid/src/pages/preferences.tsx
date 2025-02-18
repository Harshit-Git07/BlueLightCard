import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts, MarketingPreferences } from '@bluelightcard/shared-ui';
import AccountPagesHeader from '@/page-components/account/AccountPagesHeader';

const PreferencesPage: NextPage = () => {
  useRouterReady();

  return (
    <>
      <AccountPagesHeader title="Preferences" />
      <CardVerificationAlerts />
      <div className="p-[16px]">
        <MarketingPreferences />
      </div>
    </>
  );
};

export default PreferencesPage;
