import { Amplitude } from '@/utils/amplitude/amplitude';
import {
  logGlobalNavigationBrowseCategoriesClicked,
  logGlobalNavigationMyAccountClicked,
  logGlobalNavigationMyCardClicked,
  logGlobalNavigationNotificationsClicked,
  logGlobalNavigationOffersClicked,
} from '@/utils/amplitude/logGlobalNavigation';

const userUuid = 'user-uuid';
const origin = 'origin';

const givenMockAmplitudeIsInitialised = () => {
  const trackEventAsyncMock = jest
    .spyOn(Amplitude.prototype, 'trackEventAsync')
    .mockImplementation((_event, _data) => Promise.resolve({} as any));
  const setUserIdMock = jest
    .spyOn(Amplitude.prototype, 'setUserId')
    .mockImplementation((_userId) => Promise.resolve());
  const amplitude = new Amplitude();

  return { trackEventAsyncMock, setUserIdMock, amplitude };
};

describe('logGlobalNavigation', () => {
  const { trackEventAsyncMock, setUserIdMock, amplitude } = givenMockAmplitudeIsInitialised();

  it('should log global navigation offers clicked event', () => {
    const offerPage = 'offer-page';

    logGlobalNavigationOffersClicked({ amplitude, userUuid, offerPage, origin });

    shouldLogEvent('global_navigation_offers_clicked', {
      offer_page: offerPage,
      origin,
    });
  });

  it('should log global navigation browse categories clicked event', () => {
    const categoryPage = 'category-page';

    logGlobalNavigationBrowseCategoriesClicked({ amplitude, userUuid, categoryPage, origin });

    shouldLogEvent('global_navigation_browse_categories_clicked', {
      category_page: categoryPage,
      origin,
    });
  });

  it('should log global navigation My Card clicked event', () => {
    logGlobalNavigationMyCardClicked({ amplitude, userUuid, origin });

    shouldLogEvent('global_navigation_my_card_clicked', { origin });
  });

  it('should log global navigation My Account clicked event', () => {
    logGlobalNavigationMyAccountClicked({ amplitude, userUuid, origin });

    shouldLogEvent('global_navigation_my_account_clicked', { origin });
  });

  it('should log global navigation notifications clicked event', () => {
    logGlobalNavigationNotificationsClicked({ amplitude, userUuid, origin });

    shouldLogEvent('global_navigation_notifications_clicked', { origin });
  });

  it('should handle amplitude timeout', async () => {
    trackEventAsyncMock.mockImplementationOnce(async (_event, _data) => {
      await new Promise((resolve) => setTimeout(resolve, 2001));
      return {} as any;
    });

    const result = await logGlobalNavigationNotificationsClicked({ amplitude, userUuid, origin });

    expect(result).toBe('Timeout limit reached for Amplitude Event');
  });

  const shouldLogEvent = (event: string, data: any) => {
    expect(trackEventAsyncMock).toHaveBeenCalledWith(event, data);
    expect(setUserIdMock).toHaveBeenCalledWith(userUuid);
  };
});
