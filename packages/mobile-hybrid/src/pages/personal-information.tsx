import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts, PersonalInformation } from '@bluelightcard/shared-ui';
import AccountPagesHeader from '@/page-components/account/AccountPagesHeader';

const PersonalDetailsPage: NextPage = () => {
  useRouterReady();
  return (
    <>
      <AccountPagesHeader title="Personal Information" />
      <CardVerificationAlerts />
      <div className="p-[16px]">
        <PersonalInformation />
      </div>
    </>
  );
};

export default PersonalDetailsPage;
