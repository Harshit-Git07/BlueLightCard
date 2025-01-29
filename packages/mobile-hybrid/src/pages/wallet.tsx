import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts, useMemberId } from '@bluelightcard/shared-ui';
import AccountPagesHeader from '@/page-components/account/AccountPagesHeader';

const WalletPage: NextPage = () => {
  useRouterReady();

  const memberUuid = useMemberId();

  return (
    <>
      <AccountPagesHeader title="Wallet" />
      <CardVerificationAlerts memberUuid={memberUuid} />
      <div className="flex justify-center p-[16px]">
        <h2>Coming Soon...</h2>
      </div>
    </>
  );
};

export default WalletPage;
