import React from 'react';
import { render, screen } from '@testing-library/react';
import { useMedia } from 'react-use';
import { useAtom } from 'jotai';
import CompanyOffers from '../CompanyOffers';
import { companyDataAtom, selectedFilter } from '../../atoms';

// Mock the useMedia hook
jest.mock('react-use', () => ({
  useMedia: jest.fn(),
}));

// Mock the useAtom hook
jest.mock('jotai', () => ({
  useAtom: jest.fn(),
  atom: jest.requireActual('jotai').atom,
}));

const mockUseMedia = useMedia as jest.Mock;
const mockUseAtom = useAtom as jest.Mock;

describe('Company Offers Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should render No offers have been found on desktop', () => {
    // Mock useMedia to return false (desktop)
    mockUseMedia.mockReturnValue(false);

    // Mock useAtom to return empty offers
    mockUseAtom.mockImplementation((atom) => {
      if (atom === companyDataAtom) {
        return [{ offers: [] }];
      }
      if (atom === selectedFilter) {
        return ['All'];
      }
      return [];
    });

    const { getByRole } = render(<CompanyOffers />);
    expect(getByRole('heading', { name: /no offers have been found\./i })).toBeTruthy();
  });

  it('should render No offers have been found on mobile', () => {
    // Mock useMedia to return true (mobile)
    mockUseMedia.mockReturnValue(true);

    // Mock useAtom to return empty offers
    mockUseAtom.mockImplementation((atom) => {
      if (atom === companyDataAtom) {
        return [{ offers: [] }];
      }
      if (atom === selectedFilter) {
        return ['All'];
      }
      return [];
    });

    const { getByRole } = render(<CompanyOffers />);
    expect(getByRole('heading', { name: /no offers have been found\./i })).toBeTruthy();
  });

  it('should render offers when available on desktop', () => {
    // Mock useMedia to return false (desktop)
    mockUseMedia.mockReturnValue(false);

    // Mock useAtom to return empty offers
    mockUseAtom.mockImplementation((atom) => {
      if (atom === companyDataAtom) {
        return [
          {
            offers: [
              { id: 1, name: 'Offer 1', image: 'image1.jpg', type: 'Type1' },
              { id: 2, name: 'Offer 2', image: 'image2.jpg', type: 'Type2' },
            ],
          },
        ];
      }
      if (atom === selectedFilter) {
        return ['All'];
      }
      return [];
    });

    const { queryByText, getByRole, container } = render(<CompanyOffers />);
    expect(queryByText(/no offers have been found\./i)).toBeFalsy();
    expect(getByRole('img', { name: /offer 1 offer/i })).toBeTruthy();
    expect(getByRole('img', { name: /offer 2 offer/i })).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should render offers when available on mobile', () => {
    // Mock useMedia to return false (desktop)
    mockUseMedia.mockReturnValue(true);

    // Mock useAtom to return empty offers
    mockUseAtom.mockImplementation((atom) => {
      if (atom === companyDataAtom) {
        return [
          {
            offers: [
              { id: 1, name: 'Offer 1', image: 'image1.jpg', type: 'Type1' },
              { id: 2, name: 'Offer 2', image: 'image2.jpg', type: 'Type2' },
            ],
          },
        ];
      }
      if (atom === selectedFilter) {
        return ['All'];
      }
      return [];
    });

    const { queryByText, getByRole, container } = render(<CompanyOffers />);
    expect(queryByText(/no offers have been found\./i)).toBeFalsy();
    expect(getByRole('img', { name: /offer 1 offer/i })).toBeTruthy();
    expect(getByRole('img', { name: /offer 2 offer/i })).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});
