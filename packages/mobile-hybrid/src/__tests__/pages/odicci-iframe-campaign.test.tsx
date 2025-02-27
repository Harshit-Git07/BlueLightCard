import '@testing-library/jest-dom/extend-expect';
import { FC, PropsWithChildren } from 'react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import {
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../shared-ui/src/adapters';
import { userProfile } from '@/components/UserProfileProvider/store';
import Spinner from '@/modules/Spinner';
import OdicciIframeCampaignPage from '@/pages/odicci-iframe-campaign';

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  query: {
    iframeUrl: 'https://api.odicci.com/widgets/iframe_loaders/8d11f7da521240eda77f',
  },
};

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('Odicci Iframe Campaign Page', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();

  const WithSpinner: FC<PropsWithChildren> = ({ children }) => {
    return (
      <div>
        {children}
        <Spinner />
      </div>
    );
  };

  const whenPageIsRendered = async (platformAdapter = mockPlatformAdapter) => {
    return act(() =>
      render(
        <PlatformAdapterProvider adapter={platformAdapter}>
          <RouterContext.Provider value={mockRouter as NextRouter}>
            <JotaiTestProvider
              initialValues={[
                [
                  userProfile,
                  { service: 'test-organisation', isAgeGated: true, uuid: 'mock-uuid-1' },
                ],
              ]}
            >
              <WithSpinner>
                <OdicciIframeCampaignPage />
              </WithSpinner>
            </JotaiTestProvider>
          </RouterContext.Provider>
        </PlatformAdapterProvider>,
      ),
    );
  };

  it('should render the back button', async () => {
    await whenPageIsRendered();
    const backButton = await screen.findByText('Back to Home');

    expect(backButton).toBeInTheDocument();
  });

  it('should navigate back to the home page when the back button is clicked', async () => {
    await whenPageIsRendered();
    const backButton = await screen.findByText('Back to Home');

    await userEvent.click(backButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should load the Odicci iframe', async () => {
    const { container } = await whenPageIsRendered();

    const iframeElement = await screen.findByTestId('odicci-iframe');

    expect(iframeElement).toBeInTheDocument();
    expect(iframeElement).toHaveAttribute(
      'src',
      'https://api.odicci.com/widgets/iframe_loaders/8d11f7da521240eda77f?odicci_external_user_id=mock-uuid-1',
    );
  });

  describe('Button onClick events', () => {
    beforeEach(async () => {
      await whenPageIsRendered();
    });

    const whenTermsClicked = async () => {
      const termsButton = await screen.findByText('Terms and Conditions');
      await userEvent.click(termsButton);
      return termsButton;
    };

    const whenBoostedOffersClicked = async () => {
      const boostedOffers = await screen.findByText('Boosted Offers');
      await userEvent.click(boostedOffers);
      return boostedOffers;
    };

    it('should render both Terms and Conditions and Boosted Offers buttons', async () => {
      const termsButton = await screen.findByText('Terms and Conditions');
      const boostedOffers = await screen.findByText('Boosted Offers');

      expect(termsButton).toBeInTheDocument();
      expect(boostedOffers).toBeInTheDocument();
    });

    it('should log an analytics event when the Terms and Conditions button is clicked', async () => {
      await whenTermsClicked();
      expect(mockPlatformAdapter.logAnalyticsEvent).toHaveBeenCalledWith('blue_rewards_clicked', {
        click_type: 'T&Cs',
      });
    });

    it('should log an analytics event when the Boosted Offers button is clicked', async () => {
      await whenBoostedOffersClicked();
      expect(mockPlatformAdapter.logAnalyticsEvent).toHaveBeenCalledWith('blue_rewards_clicked', {
        click_type: 'Boosted Offers',
      });
    });

    it('should navigate to the external T&Cs URL when the Terms and Conditions button is clicked', async () => {
      await whenTermsClicked();
      expect(mockPlatformAdapter.navigateExternal).toHaveBeenCalledWith(
        'https://prizedraw-terms-conditions.bluelightcard.co.uk/',
      );
    });

    it('should navigate to the Big Blue Rewards flexible offers page when the Boosted Offers button is clicked', async () => {
      await whenBoostedOffersClicked();
      expect(mockPlatformAdapter.navigate).toHaveBeenCalledWith('/flexibleOffers.php?id=0');
    });
  });
});
