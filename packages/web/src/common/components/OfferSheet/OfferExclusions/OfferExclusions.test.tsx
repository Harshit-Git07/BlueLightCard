import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OfferExclusions from './OfferExclusions';

describe('OfferExclusions Component', () => {
  it('renders correctly the text on top and the image', () => {
    const exclusionsArr = ['Item 1', 'Item 2', 'Item 3'];
    render(
      <OfferExclusions
        exclusionsArr={exclusionsArr}
        navigateBack={() => void 0}
        openExclusionsDetails={true}
        iconSrc={'/assets/box-open-light-slash.svg'}
        text={'item(s)'}
      />
    );

    expect(screen.getByText('This offer is not valid on the following item(s):')).toBeVisible();
  });

  it('renders correctly the text on top and the image', () => {
    const exclusionsArr = ['Item 1', 'Item 2', 'Item 3'];
    render(
      <OfferExclusions
        exclusionsArr={exclusionsArr}
        navigateBack={() => void 0}
        openExclusionsDetails={true}
        iconSrc={'/assets/store-light-slash.svg'}
        text={'store(s)'}
      />
    );

    expect(screen.getByText('This offer is not valid on the following store(s):')).toBeVisible();
  });

  it('renders correctly the the array with some elements', () => {
    const exclusionsArr = ['Item 1', 'Item 2', 'Item 3'];
    render(
      <OfferExclusions
        exclusionsArr={exclusionsArr}
        navigateBack={() => void 0}
        openExclusionsDetails={true}
        iconSrc={'/assets/box-open-light-slash.svg'}
        text={'items(s)'}
      />
    );

    exclusionsArr.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('renders correctly with empty exclusions', () => {
    const { queryByRole } = render(
      <OfferExclusions
        exclusionsArr={[]}
        navigateBack={() => void 0}
        openExclusionsDetails={true}
        iconSrc={'/assets/box-open-light-slash.svg'}
        text={'item(s)'}
      />
    );

    expect(queryByRole('listitem')).not.toBeInTheDocument();
  });
});
