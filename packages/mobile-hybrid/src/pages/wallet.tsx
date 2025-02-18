import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts } from '@bluelightcard/shared-ui';
import AccountPagesHeader from '@/page-components/account/AccountPagesHeader';

const WalletPage: NextPage = () => {
  useRouterReady();

  return (
    <>
      <AccountPagesHeader title="Wallet" hasBackButton={false} />
      <CardVerificationAlerts />
      <div className="flex justify-center p-[16px]">
        <h2>Coming Soon...</h2>
      </div>
    </>
  );
};

export default WalletPage;
