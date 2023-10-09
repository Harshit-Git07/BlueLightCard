import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import Search from '@/components/Header/Search';
import { SearchProps } from '@/components/Header/types';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

describe('Search component', () => {
  let props: SearchProps;
  beforeEach(() => {
    props = {
      onSearchCompanyChange(companyId, company) {
        companyId = '10';
        company = 'test';
        return companyId;
      },
      onSearchCategoryChange(categoryId, categoryName) {
        categoryId = '123';
        categoryName = 'testCat';
        return categoryName;
      },
      onSearchTerm(searchTerm) {
        searchTerm = 'Asda';
        return searchTerm;
      },
    };
  });
  describe('Search form is rendered', () => {
    it('should render component without error', () => {
      render(<Search {...props} />);
    });
  });
  describe('Search heading rendered', () => {
    it('should render heading without error', () => {
      render(<Search {...props} />);
      const heading = screen.getByRole('heading');
      expect(heading).toBeTruthy();
    });
    it('should contain  the search heading', () => {
      render(<Search {...props} />);
      const heading = screen.getByRole('heading', { name: 'Find offers' });
      expect(heading).toBeTruthy();
    });
  });

  describe('Search by company', () => {
    it('should company search', () => {
      render(<Search {...props} />);
      const companySearch = screen.getByText('By company');
      expect(companySearch).toBeTruthy();
    });
  });

  describe('Search by company options', () => {
    it('should render company options to search', () => {
      render(<Search {...props} />);
      const companySearch = screen.getAllByRole('option');
      companySearch.forEach((company) => expect(company).toBeInTheDocument());
    });
  });

  describe('Search by category', () => {
    it('should category search', () => {
      render(<Search {...props} />);
      const categorySearch = screen.getAllByText('by category');
      expect(categorySearch).toBeTruthy();
    });
  });

  describe('Search by company combobox', () => {
    it('should display list of companies', () => {
      render(<Search {...props} />);
      const companyComboBox = screen.getAllByRole('combobox');
      companyComboBox.forEach((combobox) => expect(combobox).toBeInTheDocument());
    });
  });

  describe('Search by phrase input form', () => {
    it('should display search field', () => {
      render(<Search {...props} />);
      const phraseSearchField = screen.getByRole('textbox');
      expect(phraseSearchField).toBeTruthy();
    });
  });

  describe('Search button for to submit phrase', () => {
    it('should phrase search button', () => {
      render(<Search {...props} />);
      const companySearchButton = screen.getByRole('button');
      expect(companySearchButton).toBeTruthy();
    });
  });
});
