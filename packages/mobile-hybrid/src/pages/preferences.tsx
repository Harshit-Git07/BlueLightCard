import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts, useMemberId } from '@bluelightcard/shared-ui';
import AccountPagesHeader from '@/page-components/account/AccountPagesHeader';

const PreferencesPage: NextPage = () => {
  useRouterReady();

  const memberUuid = useMemberId();

  return (
    <>
      <AccountPagesHeader title="Preferences" />
      <CardVerificationAlerts memberUuid={memberUuid} />
      <div>Contact preferences page</div>
    </>
  );
};

export default PreferencesPage;
