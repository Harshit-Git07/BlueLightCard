import { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ENVIRONMENT } from '@/root/global-vars';
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
import { useAmplitudeExperiment } from '../../context/AmplitudeExperiment';
import { AmplitudeExperimentFlags } from '../../utils/amplitude/AmplitudeExperimentFlags';
import AuthContext from '../../context/Auth/AuthContext';

const BaseAccountLayout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isMobile = useMedia('(max-width: 767px)');
  const authContext = useContext(AuthContext);
  const loggedIn = authContext.isUserAuthenticated();

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

  const { status, data: accountFlag } = useAmplitudeExperiment(
    AmplitudeExperimentFlags.MODERN_MY_ACCOUNT,
    'off'
  );

  useEffect(() => {
    if (ENVIRONMENT === 'local') {
      return;
    }

    if (
      authContext.isReady &&
      (!loggedIn || (status !== 'pending' && accountFlag?.variantName !== 'on' && router.isReady))
    ) {
      router.push('/');
    }
  }, [accountFlag, router, status, loggedIn, authContext, ENVIRONMENT]);

  if (ENVIRONMENT !== 'local' && accountFlag?.variantName !== 'on') {
    return null;
  }

  return (
    <div className={`flex flex-col ${isOpen ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <MyAccountDebugToolsLazily />
      <Drawer />
      <Toaster />
      <Navigation onToggleMobileSideBar={toggleDrawer} />
      <CardVerificationAlerts memberUuid={memberId} />

      <div className="pl-[16px] mt-[32px] flex flex-col hidden tablet:block desktop:container mx-[20px] desktop:mx-auto">
        <AccountDetails
          accountNumber={card?.cardNumber}
          firstName={memberProfile?.firstName ?? ''}
          lastName={memberProfile?.lastName ?? ''}
        />
      </div>

      <div
        className={`mt-[24px] relative grow pb-16 flex gap-[24px] h-full desktop:container desktop:mx-auto tablet:mx-5`}
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

        <div className={`w-full px-[18px] tablet:px-0 min-h-[300px]`}>{children}</div>
      </div>

      {!isOpen ? <Footer isAuthenticated /> : null}
    </div>
  );
};

export default BaseAccountLayout;
