import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AccountDetails,
  CardVerificationAlerts,
  Drawer,
  Toaster,
  useMemberCard,
  useMemberId,
  useMemberProfileGet,
} from '@bluelightcard/shared-ui';

import { LayoutProps } from './types';
import Footer from '../../../common/components/Footer/Footer';
import { useMedia } from 'react-use';
import LeftNavigation from './LeftNavigation';
import MyAccountDebugToolsLazily from '@/layouts/AccountBaseLayout/MyAccountToolsLazily';
import Navigation from '../../components/Navigation/Navigation';

const BaseAccountLayout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isMobile = useMedia('(max-width: 767px)');

  const memberId = useMemberId();

  const { memberProfile } = useMemberProfileGet(memberId);
  const { card } = useMemberCard(memberId);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const linkSelectionHandler = (href: string) => {
    setIsOpen(false);

    router.push(href);
  };

  return (
    <div className={`flex flex-col ${isOpen ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <MyAccountDebugToolsLazily />
      <Drawer />
      <Toaster />
      <Navigation />
      <CardVerificationAlerts memberUuid={memberId} />

      <div className="pl-[16px] mt-[32px] flex flex-col hidden tablet:block desktop:container mx-[20px] desktop:mx-auto">
        <AccountDetails
          accountNumber={card?.cardNumber}
          firstName={memberProfile?.firstName ?? ''}
          lastName={memberProfile?.lastName ?? ''}
        />
      </div>

      <div
        className={`mt-6 relative grow pb-16 flex gap-2 h-full desktop:container desktop:mx-auto tablet:mx-5`}
      >
        <LeftNavigation
          firstName={memberProfile?.firstName ?? ''}
          lastName={memberProfile?.lastName ?? ''}
          isOpen={isOpen}
          accountNumber={card?.cardNumber}
          onLinkSelection={linkSelectionHandler}
          onCloseDrawer={toggleDrawer}
        />

        {isOpen ? (
          <div
            className="block tablet:hidden w-full h-full bg-black/50 absolute"
            onClick={toggleDrawer}
            aria-hidden={true}
          />
        ) : null}

        <div className={`w-full px-5 tablet:px-0 min-h-[300px]`}>{children}</div>
      </div>

      {!isOpen ? <Footer isAuthenticated /> : null}
    </div>
  );
};

export default BaseAccountLayout;
