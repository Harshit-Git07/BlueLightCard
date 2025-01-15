import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import {
  CardVerificationAlerts,
  MarketingPreferences,
  useMemberId,
} from '@bluelightcard/shared-ui';
import AccountPagesHeader from '@/page-components/account/AccountPagesHeader';

const PreferencesPage: NextPage = () => {
  useRouterReady();

  const memberUuid = useMemberId();

  return (
    <>
      <AccountPagesHeader title="Preferences" />
      <CardVerificationAlerts memberUuid={memberUuid} />
      <div className="p-[16px]">
        <MarketingPreferences memberUuid={memberUuid} />
      </div>
    </>
  );
};

export default PreferencesPage;
