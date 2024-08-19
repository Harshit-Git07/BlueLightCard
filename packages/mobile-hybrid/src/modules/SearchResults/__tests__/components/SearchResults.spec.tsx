import { FC, PropsWithChildren } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import Spinner from '@/modules/Spinner';
import InvokeNativeAnalytics from '@/invoke/analytics';
import { AmplitudeEvents } from '@/utils/amplitude/amplitudeEvents';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { searchResultsAtom, searchTermAtom } from '@/hooks/useSearch';
import SearchResultsContainer from '@/modules/SearchResults/components/SearchResultsContainer';
import { OfferListItemModel } from '@/models/offer';
import { offerListItemFactory, searchResultV5Factory } from '@/modules/List/__mocks__/factory';
import '@testing-library/jest-dom';
import { SearchResults, SearchResultsV5 } from '@/modules/SearchResults/types';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { Experiments, FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import { userProfile } from '@/components/UserProfileProvider/store';
import useAPI from '@/hooks/useAPI';

jest.mock('@/invoke/apiCall');
jest.mock('@/invoke/analytics');
jest.mock('@/hooks/useAPI');

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

let testData: OfferListItemModel[];
let testDataV5: SearchResultsV5;

describe('Search results', () => {
  const searchTermValue = 'pizza';
  let analyticsMock: jest.SpyInstance<void, [properties: NativeAnalytics.Parameters], any>;
  let user: UserEvent;

  beforeEach(() => {
    jest.resetAllMocks();
    analyticsMock = jest
      .spyOn(InvokeNativeAnalytics.prototype, 'logAnalyticsEvent')
      .mockImplementation(() => jest.fn());
    jest.mocked(useAPI);
    user = userEvent.setup();
    testData = offerListItemFactory.buildList(2);
    testData[1].companyname = 'Test Company';
    testData[1].offername = 'Test Offer';
    testDataV5 = searchResultV5Factory.buildList(2);
    testDataV5[1].CompanyName = 'Test Company';
    testDataV5[1].OfferName = 'Test Offer';
  });

  describe('render results', () => {
    it('should render list of results', async () => {
      await act(() => whenSearchResultsPageIsRendered(searchTermValue, testData));

      const results = await screen.findAllByRole('listitem');
      expect(results).toHaveLength(2);
    });

    it('should show no results found when nothing found', async () => {
      whenSearchResultsPageIsRendered(searchTermValue, []);

      await screen.findByText('No results found.');
    });
  });

  describe('log analytics events', () => {
    it('should log analytics event on results returned', async () => {
      whenSearchResultsPageIsRendered(searchTermValue, testData);

      await waitFor(() =>
        expect(analyticsMock).toHaveBeenCalledWith({
          event: AmplitudeEvents.SEARCH_RESULTS_LIST_VIEWED,
          parameters: {
            search_term: searchTermValue,
            number_of_results: 2,
          },
        }),
      );
    });

    it('should log analytics event when list item is clicked', async () => {
      whenSearchResultsPageIsRendered(searchTermValue, testData);

      const listItems = await screen.findAllByRole('button');

      act(() => {
        fireEvent.click(listItems[1]);
      });

      expect(analyticsMock.mock.calls[1][0]).toEqual({
        event: AmplitudeEvents.SEARCH_RESULTS_LIST_CLICKED,
        parameters: {
          search_term: searchTermValue,
          number_of_results: 2,
          company_id: testData[1].compid,
          company_name: testData[1].companyname,
          offer_id: testData[1].id,
          offer_name: testData[1].offername,
          search_result_number: 2,
        },
      });
    });
  });

  const WithSpinner: FC<PropsWithChildren> = ({ children }) => {
    return (
      <div>
        {children}
        <Spinner />
      </div>
    );
  };

  const whenSearchResultsPageIsRendered = (
    term: string = '',
    existingSearchResults: SearchResults = [],
    categoryLevelThreeSearchExperiment = 'control',
    platformAdapter = mockPlatformAdapter,
    v5EndpointsFlag = 'off',
  ) => {
    return render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <JotaiTestProvider
          initialValues={[
            [searchTermAtom, term],
            [searchResultsAtom, existingSearchResults],
            [
              experimentsAndFeatureFlags,
              {
                [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: categoryLevelThreeSearchExperiment,
                [FeatureFlags.V5_API_INTEGRATION]: v5EndpointsFlag,
              },
            ],
            [userProfile, { service: 'DEN' }],
          ]}
        >
          <WithSpinner>
            <SearchResultsContainer />
          </WithSpinner>
        </JotaiTestProvider>
      </PlatformAdapterProvider>,
    );
  };

  const mockPlatformAdapter = useMockPlatformAdapter();
});
