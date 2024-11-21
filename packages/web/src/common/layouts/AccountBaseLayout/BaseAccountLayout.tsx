import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccountDetails, useGetCustomerProfile } from '@bluelightcard/shared-ui';
import { BRAND } from '@/global-vars';
import NavBar from '../../components/NavBar/NavBar';
import { LayoutProps } from './types';
import Footer from '../../../common/components/Footer/Footer';
import { useMedia } from 'react-use';
import LeftNavigation from './LeftNavigation';

const BaseAccountLayout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isMobile = useMedia('(max-width: 767px)');

  const memberUuid = 'member-uuid';

  const { data: customerProfile } = useGetCustomerProfile(BRAND, memberUuid);

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

  const onSearchCompanyChange = async () => {
    // await logSearchCompanyEvent(companyId, company);
    // window.location.href = getCompanyOfferDetailsUrl(companyId);
  };

  const onSearchCategoryChange = async () => {
    // await logSearchCategoryEvent(categoryId, categoryName);
    // window.location.href = getOffersByCategoryUrl(categoryId);
  };

  const onSearchTerm = async () => {
    // await logSearchTermEvent(searchTerm);
    // window.location.href = getOffersBySearchTermUrl(searchTerm);
  };

  return (
    <div className={`flex flex-col ${isOpen ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <NavBar
        isAuthenticated
        onSearchCompanyChange={onSearchCompanyChange}
        onSearchCategoryChange={onSearchCategoryChange}
        onSearchTerm={onSearchTerm}
        onToggleMobileSideBar={toggleDrawer}
      />

      <div className="pl-4 mt-16 flex flex-col hidden tablet:block desktop:container mx-5 desktop:mx-auto">
        <AccountDetails
          accountNumber={customerProfile?.card.cardNumber}
          firstName="Name"
          lastName="Last-name"
        />
      </div>

      <div
        className={`mt-6 relative grow pb-16 flex gap-2 h-full desktop:container desktop:mx-auto tablet:mx-5`}
      >
        <LeftNavigation
          isOpen={isOpen}
          accountNumber={customerProfile?.card.cardNumber}
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
