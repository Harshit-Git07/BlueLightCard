// components/Layout.tsx
import { ReactNode } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import {
  logSearchCompanyEvent,
  logSearchCategoryEvent,
  logSearchTermEvent,
} from '@/utils/amplitude';

import { navItems } from '@/data/headerConfig';
import footerConfig from '@/data/footerConfig';

interface LayoutProps {
  children: ReactNode;
}

const BaseLayout: React.FC<LayoutProps> = ({ children }) => {
  const onSearchCompanyChange = (companyId: string, company: string) => {
    logSearchCompanyEvent(companyId, company);
    window.location.href = `/offerdetails.php?cid=${companyId}`;
  };

  const onSearchCategoryChange = (categoryId: string, categoryName: string) => {
    logSearchCategoryEvent(categoryId, categoryName);
    window.location.href = `/offers.php?cat=true&type=${categoryId}`;
  };

  const onSearchTerm = (searchTerm: string) => {
    logSearchTermEvent(searchTerm);
    window.location.href = `/offers.php?type=1&opensearch=1&search=${searchTerm}`;
  };

  return (
    <div>
      <Header
        navItems={navItems}
        loggedIn={true}
        onSearchCompanyChange={onSearchCompanyChange}
        onSearchCategoryChange={onSearchCategoryChange}
        onSearchTerm={onSearchTerm}
      />
      <div>{children}</div>
      <Footer {...footerConfig} />
    </div>
  );
};

export default BaseLayout;
