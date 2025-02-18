import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts, useMemberId, Card, fonts } from '@bluelightcard/shared-ui';
import AccountPagesHeader from '@/page-components/account/AccountPagesHeader';

import InvokeNativeNavigation from '@/invoke/navigation';
import FaqBlc from '@/components/Help/FaqBlc';
import FaqDds from '../components/Help/FaqDds';
import ChatBlc from '@/components/Help/ChatBlc';
import ChatDds from '@/components/Help/ChatDds';
import { BRAND } from '@/globals';
import { BRANDS } from '@/types/brands.enum';

const HelpPage: NextPage = () => {
  useRouterReady();

  const navigation = new InvokeNativeNavigation();

  const FaqSvg = BRAND === BRANDS.DDS_UK ? FaqDds : FaqBlc;
  const ChatSvg = BRAND === BRANDS.DDS_UK ? ChatDds : ChatBlc;

  return (
    <>
      <AccountPagesHeader title="Help" />
      <CardVerificationAlerts />
      <div className="p-[16px]">
        <h2
          className={`pb-[24px] text-left text-colour-onSurface dark:text-colour-onSurface-dark ${fonts.titleMedium}`}
        >
          How can we help?
        </h2>
        <Card
          cardTitle="FAQs"
          description="Find quick answers to common issues"
          imageSvg={<FaqSvg width="80px" height="92px" className="p-[8px]" />}
          imageAlt="FAQs Icon"
          buttonTitle="Learn More"
          cardOnClick={() => navigation.navigate('/faq')}
          showButton={false}
        />
        <div className="mb-[12px]" />
        <Card
          cardTitle="Get in Touch"
          description="Chat with our support team or submit a request"
          imageSvg={<ChatSvg width="80px" height="92px" className="p-[8px]" />}
          imageAlt="Chat Icon"
          buttonTitle="Start Chat"
          cardOnClick={() => navigation.navigate('/chat')}
          showButton={false}
        />
      </div>
    </>
  );
};

export default HelpPage;
