import { NextPage } from 'next';
import useRouterReady from '@/hooks/useRouterReady';
import { CardVerificationAlerts, useMemberId } from '@bluelightcard/shared-ui';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { fonts } from '../../../shared-ui/src/tailwind/theme';
import InvokeNativeNavigation from '@/invoke/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FaqBlc from '@/components/Help/FaqBlc';
import FaqDds from '../components/Help/FaqDds';
import ChatBlc from '@/components/Help/ChatBlc';
import ChatDds from '@/components/Help/ChatDds';
import { BRAND } from '@/globals';
import Card from '../../../shared-ui/src/components/Card';
import { BRANDS } from '@/types/brands.enum';

const HelpPage: NextPage = () => {
  const memberId = useMemberId();
  useRouterReady();

  const navigation = new InvokeNativeNavigation();

  const onBackButtonClick = () => {
    window.history.back();
  };

  const FaqSvg = BRAND === BRANDS.DDS_UK ? FaqDds : FaqBlc;
  const ChatSvg = BRAND === BRANDS.DDS_UK ? ChatDds : ChatBlc;

  return (
    <>
      <CardVerificationAlerts memberUuid={memberId} />

      <div className="p-3 grid grid-cols-3 border-b-[0.2px] border-colour-onSurface-outline-outline-subtle-light dark:border-colour-onSurface-outline-outline-subtle-dark">
        <button
          onClick={onBackButtonClick}
          className="text-start text-colour-primary-light dark:text-colour-primary-dark text-lg"
        >
          <FontAwesomeIcon
            data-testid="back-icon"
            icon={faChevronLeft}
            size="xs"
            className="pr-2 text-colour-primary-light dark:text-colour-primary-dark"
          />
          Back
        </button>
        <div className="grid-cols-2">
          <h1
            className={`pb-1 text-center text-colour-onSurface dark:text-colour-onSurface-dark ${fonts.titleMedium}`}
          >
            Help
          </h1>
        </div>
      </div>
      <div className="flex flex-col p-[18px]">
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
