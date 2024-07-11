import { Experiments } from '@/components/AmplitudeProvider/amplitudeKeys';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Offers from '@/modules/offers';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';

jest.mock('swiper/react', () => ({
  Swiper: () => null,
  SwiperSlide: () => null,
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());
jest.mock('swiper/css/pagination', () => jest.fn());
jest.mock('swiper/css/navigation', () => jest.fn());

describe('Offers', () => {
  describe('Streamlined homepage experiment', () => {
    it('should not render "News" when experiment is on', () => {
      const experiments = {
        [Experiments.STREAMLINED_HOMEPAGE]: 'on',
      };

      whenOffersModuleIsRendered(experiments);

      const newsTitle = screen.queryByText('Latest news');
      expect(newsTitle).not.toBeInTheDocument();
    });

    it('should render "News" when experiment is off', () => {
      const experiments = {
        [Experiments.STREAMLINED_HOMEPAGE]: 'off',
      };

      whenOffersModuleIsRendered(experiments);

      const newsTitle = screen.queryByText('Latest news');
      expect(newsTitle).toBeInTheDocument();
    });
  });

  const whenOffersModuleIsRendered = (experiments: Record<string, string>) => {
    render(
      <JotaiTestProvider initialValues={[[experimentsAndFeatureFlags, experiments]]}>
        <Offers />
      </JotaiTestProvider>,
    );
  };
});
