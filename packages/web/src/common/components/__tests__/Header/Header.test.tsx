import { render } from '@/root/test-utils';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import Header from '@/components/Header/Header';
import { HeaderProps } from '@/components/Header/types';

describe('Header component', () => {
  let props: HeaderProps;
  beforeEach(() => {
    props = {
      onSearchCompanyChange(companyId, company) {},
      onSearchCategoryChange(categoryId, company) {},
      onSearchTerm(searchTerm) {},
    };
  });
  describe('Header is rendered', () => {
    it('should render component without error', () => {
      render(<Header {...props} />);
    });
  });
});
