import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { render, screen } from '@testing-library/react';
import PopularBrandsSlider from '..';
import '@testing-library/jest-dom/extend-expect';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';

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
    render(
      <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, experiments]]}>
        <PopularBrandsSlider />
      </JotaiTestProvider>,
    );
  };
});
