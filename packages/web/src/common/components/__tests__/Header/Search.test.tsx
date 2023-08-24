import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import Search from '@/components/Header/Search';

describe('Search component', () => {
  describe('Search form is rendered', () => {
    it('should render component without error', () => {
      render(<Search />);
    });
  });
  describe('Search heading rendered', () => {
    it('should render heading without error', () => {
      render(<Search />);
      const heading = screen.getByRole('heading');
      expect(heading).toBeTruthy();
    });
    it('should contain  the search heading', () => {
      render(<Search />);
      const heading = screen.getByRole('heading', { name: 'Find offers' });
      expect(heading).toBeTruthy();
    });
  });

  describe('Search by company', () => {
    it('should company search', () => {
      render(<Search />);
      const companySearch = screen.getByText('By company');
      expect(companySearch).toBeTruthy();
    });
  });

  describe('Search by company options', () => {
    it('should render company options to search', () => {
      render(<Search />);
      const companySearch = screen.getAllByRole('option');
      companySearch.forEach((company) => expect(company).toBeInTheDocument());
    });
  });

  describe('Search by category', () => {
    it('should category search', () => {
      render(<Search />);
      const categorySearch = screen.getByText('by category');
      expect(categorySearch).toBeTruthy();
    });
  });

  describe('Search by company combobox', () => {
    it('should display list of companies', () => {
      render(<Search />);
      const companyComboBox = screen.getAllByRole('combobox');
      companyComboBox.forEach((combobox) => expect(combobox).toBeInTheDocument());
    });
  });

  describe('Search by phrase input form', () => {
    it('should display search field', () => {
      render(<Search />);
      const phraseSearchField = screen.getByRole('textbox');
      expect(phraseSearchField).toBeTruthy();
    });
  });

  describe('Search button for to submit phrase', () => {
    it('should phrase search button', () => {
      render(<Search />);
      const companySearchButton = screen.getByRole('button');
      expect(companySearchButton).toBeTruthy();
    });
  });
});
