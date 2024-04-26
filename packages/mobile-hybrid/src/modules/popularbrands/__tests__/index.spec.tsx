import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { AppStore } from '@/store/types';
import { render, screen } from '@testing-library/react';
import { AppContext } from '@/store';
import PopularBrandsSlider from '..';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@/modules/popularbrands/brands');

describe('Popular Brands', () => {
  describe('Streamlined homepage experiment', () => {
    it('should not render subtitle when experiment is on', () => {
      const experiments = {
        [Experiments.STREAMLINED_HOMEPAGE]: 'on',
      };

      whenPopularBrandsSliderIsRendered(experiments);

      const popularBrandsSubtitle = screen.queryByText('Explore popular brands with a swipe!');
      expect(popularBrandsSubtitle).not.toBeInTheDocument();
    });

    it('should render subtitle when experiment is off', () => {
      const experiments = {
        [Experiments.STREAMLINED_HOMEPAGE]: 'off',
      };

      whenPopularBrandsSliderIsRendered(experiments);

      const popularBrandsSubtitle = screen.queryByText('Explore popular brands with a swipe!');
      expect(popularBrandsSubtitle).toBeInTheDocument();
    });
  });

  const whenPopularBrandsSliderIsRendered = (experiments: Record<string, string>) => {
    const mockAppContext: Partial<AppStore> = {
      experiments: experiments,
    };

    render(
      <AppContext.Provider value={mockAppContext as AppStore}>
        <PopularBrandsSlider />
      </AppContext.Provider>,
    );
  };
});
