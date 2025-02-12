import { SQSRecord } from 'aws-lambda';

import { handleCompanyUpdated } from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/CompanyEventHandler';
import {
  handleEventMenuThemedDeleted,
  handleEventMenuThemedUpdated,
} from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/EventMenuThemedEventHandler';
import {
  handleEventOfferDeleted,
  handleEventOfferUpdated,
} from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/EventOfferEventHandler';
import {
  handleOfferDeleted,
  handleOfferUpdated,
} from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/OfferEventHandler';
import { mapSanityCompanyLocationToCompanyLocationEvent } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityCompanyLocationToCompanyLocation';
import { mapSanityCompanyToCompany } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityCompanyToCompany';
import { mapSanityEventThemedMenuToEventThemedMenu } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityEventThemedMenuToEventThemedMenu';
import { mapSanityEventToEventOffer } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityEventToEvent';
import { mapSanityMarketPlaceMenusToMenuOffers } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityMarketplaceMenusToMenus';
import { mapSanityMenuOfferToMenuOffer } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityMenuOfferToMenuOffer';
import { mapSanityOfferToOffer } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityOfferToOffer';
import { mapSanitySiteToSite } from '@blc-mono/discovery/helpers/sanityMappers/mapSanitySiteToSite';
import { mapSanityThemedMenuToThemedMenu } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityThemedMenuToThemedMenu';
import { DetailTypes, Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';

import { menuFactory } from '../../factories/MenuFactory';
import { ingestedMenuOfferFactory } from '../../factories/MenuOfferFactory';
import { siteFactory } from '../../factories/SiteFactory';
import { MenuType } from '../../models/MenuResponse';
import { ThemedMenuOffer } from '../../models/ThemedMenu';

import { handleCompanyLocationsUpdated } from './eventHandlers/CompanyLocationEventHandler';
import { handleMarketplaceMenusDeleted, handleMarketplaceMenusUpdated } from './eventHandlers/MarketplaceEventHandler';
import { handleMenusDeleted, handleMenusUpdated } from './eventHandlers/MenusEventHandler';
import { handleMenuThemedDeleted, handleMenuThemedUpdated } from './eventHandlers/MenuThemedEventHandler';
import { handleSiteDeleted, handleSiteUpdated } from './eventHandlers/SiteEventHandler';
import { handler } from './eventQueueListener';

jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/OfferEventHandler');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/EventOfferEventHandler');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/CompanyEventHandler');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/CompanyLocationEventHandler');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/MenusEventHandler');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/MarketplaceEventHandler');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/MenuThemedEventHandler');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/SiteEventHandler');
jest.mock('@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/EventMenuThemedEventHandler');

jest.mock('@blc-mono/discovery/helpers/sanityMappers/mapSanityEventThemedMenuToEventThemedMenu');
jest.mock('@blc-mono/discovery/helpers/sanityMappers/mapSanityOfferToOffer');
jest.mock('@blc-mono/discovery/helpers/sanityMappers/mapSanityCompanyToCompany');
jest.mock('@blc-mono/discovery/helpers/sanityMappers/mapSanityMarketplaceMenusToMenus');
jest.mock('@blc-mono/discovery/helpers/sanityMappers/mapSanityMenuOfferToMenuOffer');
jest.mock('@blc-mono/discovery/helpers/sanityMappers/mapSanitySiteToSite');
jest.mock('@blc-mono/discovery/helpers/sanityMappers/mapSanityThemedMenuToThemedMenu');
jest.mock('@blc-mono/discovery/helpers/sanityMappers/mapSanityCompanyLocationToCompanyLocation');
jest.mock('@blc-mono/discovery/helpers/sanityMappers/mapSanityEventToEvent');

const handleOfferUpdatedMock = jest.mocked(handleOfferUpdated);
const handleEventOfferUpdatedMock = jest.mocked(handleEventOfferUpdated);
const handleEventOfferDeletedMock = jest.mocked(handleEventOfferDeleted);
const handleOfferDeletedMock = jest.mocked(handleOfferDeleted);
const handleCompanyUpdatedMock = jest.mocked(handleCompanyUpdated);
const handleCompanyLocationsUpdatedMock = jest.mocked(handleCompanyLocationsUpdated);
const handleMenuOfferUpdatedMock = jest.mocked(handleMenusUpdated);
const handleMenuOfferDeletedMock = jest.mocked(handleMenusDeleted);
const handleSiteUpdatedMock = jest.mocked(handleSiteUpdated);
const handleSiteDeletedMock = jest.mocked(handleSiteDeleted);
const handleMarketplaceMenusUpdatedMock = jest.mocked(handleMarketplaceMenusUpdated);
const handleMarketplaceMenusDeletedMock = jest.mocked(handleMarketplaceMenusDeleted);
const handleMenuThemedUpdatedMock = jest.mocked(handleMenuThemedUpdated);
const handleMenuThemedDeletedMock = jest.mocked(handleMenuThemedDeleted);
const handleEventMenuThemedUpdatedMock = jest.mocked(handleEventMenuThemedUpdated);
const handleEventMenuThemedDeletedMock = jest.mocked(handleEventMenuThemedDeleted);

const mapSanityOfferToOfferMock = jest.mocked(mapSanityOfferToOffer);
const mapSanityEventToEventMock = jest.mocked(mapSanityEventToEventOffer);

const mapSanityCompanyToCompanyMock = jest.mocked(mapSanityCompanyToCompany);
const mapSanityMenuOfferToMenuOfferMock = jest.mocked(mapSanityMenuOfferToMenuOffer);
const mapSanityMarketPlaceMenusToMenuOffersMock = jest.mocked(mapSanityMarketPlaceMenusToMenuOffers);
const mapSanitySiteToSiteMock = jest.mocked(mapSanitySiteToSite);
const mapSanityThemedMenuToThemedMenuMock = jest.mocked(mapSanityThemedMenuToThemedMenu);
const mapSanityCompanyLocationToCompanyLocationEventMock = jest.mocked(mapSanityCompanyLocationToCompanyLocationEvent);
const mapSanityEventThemedMenuToEventThemedMenuMock = jest.mocked(mapSanityEventThemedMenuToEventThemedMenu);

describe('eventQueueListener', () => {
  it.each([Events.OFFER_CREATED, Events.OFFER_UPDATED])('should handle %s event', async (event) => {
    const offerRecord = buildSQSRecord(event);

    await handler({ Records: [offerRecord] });

    expect(mapSanityOfferToOfferMock).toHaveBeenCalledWith('body');
    expect(handleOfferUpdatedMock).toHaveBeenCalled();
  });

  it.each([Events.EVENT_CREATED, Events.EVENT_UPDATED])('should handle %s event', async (event) => {
    const record = buildSQSRecord(event);

    await handler({ Records: [record] });

    expect(mapSanityEventToEventMock).toHaveBeenCalledWith('body');
    expect(handleEventOfferUpdatedMock).toHaveBeenCalled();
  });

  it('should handle "offer.deleted" event', async () => {
    const offerDeletedRecord = buildSQSRecord(Events.OFFER_DELETED);

    await handler({ Records: [offerDeletedRecord] });

    expect(mapSanityOfferToOfferMock).toHaveBeenCalledWith('body');
    expect(handleOfferDeletedMock).toHaveBeenCalled();
  });

  it('should handle "event.deleted" event', async () => {
    const eventDeletedRecord = buildSQSRecord(Events.EVENT_DELETED);

    await handler({ Records: [eventDeletedRecord] });

    expect(mapSanityEventToEventMock).toHaveBeenCalledWith('body');
    expect(handleEventOfferDeletedMock).toHaveBeenCalled();
  });

  it.each([Events.MENU_THEMED_EVENT_CREATED, Events.MENU_THEMED_EVENT_UPDATED])(
    'should handle %s event',
    async (event) => {
      const record = buildSQSRecord(event);

      await handler({ Records: [record] });

      expect(mapSanityEventThemedMenuToEventThemedMenuMock).toHaveBeenCalledWith('body');
      expect(handleEventMenuThemedUpdatedMock).toHaveBeenCalled();
    },
  );

  it('should handle "menu.themed.event" deleted event', async () => {
    const record = buildSQSRecord(Events.MENU_THEMED_EVENT_DELETED);

    await handler({ Records: [record] });

    expect(mapSanityEventThemedMenuToEventThemedMenuMock).toHaveBeenCalledWith('body');
    expect(handleEventMenuThemedDeletedMock).toHaveBeenCalled();
  });

  it.each([Events.COMPANY_CREATED, Events.COMPANY_UPDATED])('should handle %s event', async () => {
    const companyRecord = buildSQSRecord(Events.COMPANY_UPDATED);

    await handler({ Records: [companyRecord] });

    expect(mapSanityCompanyToCompanyMock).toHaveBeenCalledWith('body');
    expect(handleCompanyUpdatedMock).toHaveBeenCalled();
  });

  it.each([Events.COMPANY_LOCATION_BATCH_CREATED, Events.COMPANY_LOCATION_BATCH_UPDATED])(
    'should handle %s event',
    async (event) => {
      const companyLocationRecord = buildSQSRecord(event);
      await handler({ Records: [companyLocationRecord] });

      expect(mapSanityCompanyLocationToCompanyLocationEventMock).toHaveBeenCalledWith('body');
      expect(handleCompanyLocationsUpdatedMock).toHaveBeenCalled();
    },
  );

  it.each([Events.MARKETPLACE_MENUS_CREATED, Events.MARKETPLACE_MENUS_UPDATED])('should handle %s event', async () => {
    const marketplaceMenuRecord = buildSQSRecord(Events.MARKETPLACE_MENUS_UPDATED);
    const menuOffer = ingestedMenuOfferFactory.build();
    mapSanityMarketPlaceMenusToMenuOffersMock.mockReturnValue({
      updatedAt: menuOffer.updatedAt,
      ingestedMenuOffers: [menuOffer],
    });
    await handler({ Records: [marketplaceMenuRecord] });

    expect(mapSanityMarketPlaceMenusToMenuOffersMock).toHaveBeenCalledWith('body');
    expect(handleMarketplaceMenusUpdatedMock).toHaveBeenCalledWith({
      updatedAt: menuOffer.updatedAt,
      ingestedMenuOffers: [menuOffer],
    });
  });

  it('should handle "marketplace.deleted" event', async () => {
    const marketplaceMenuRecord = buildSQSRecord(Events.MARKETPLACE_MENUS_DELETED);
    const menuOffer = ingestedMenuOfferFactory.build();
    mapSanityMarketPlaceMenusToMenuOffersMock.mockReturnValue({
      updatedAt: menuOffer.updatedAt,
      ingestedMenuOffers: [menuOffer],
    });
    await handler({ Records: [marketplaceMenuRecord] });

    expect(mapSanityMarketPlaceMenusToMenuOffersMock).toHaveBeenCalledWith('body');
    expect(handleMarketplaceMenusDeletedMock).toHaveBeenCalledWith({
      updatedAt: menuOffer.updatedAt,
      ingestedMenuOffers: [menuOffer],
    });
  });

  it.each([Events.MENU_OFFER_CREATED, Events.MENU_OFFER_UPDATED])('should handle %s event', async (eventSource) => {
    const menuRecord = buildSQSRecord(eventSource);
    const menuOffer = ingestedMenuOfferFactory.build();
    mapSanityMenuOfferToMenuOfferMock.mockResolvedValue(menuOffer);
    await handler({ Records: [menuRecord] });

    expect(mapSanityMenuOfferToMenuOfferMock).toHaveBeenCalledWith('body');
    expect(handleMenuOfferUpdatedMock).toHaveBeenCalledWith(menuOffer);
  });

  it('should handle "menu.deleted" event', async () => {
    const menuDeletedRecord = buildSQSRecord(Events.MENU_OFFER_DELETED);
    const menuOffer = ingestedMenuOfferFactory.build();
    mapSanityMenuOfferToMenuOfferMock.mockResolvedValue(menuOffer);
    await handler({ Records: [menuDeletedRecord] });

    expect(mapSanityMenuOfferToMenuOfferMock).toHaveBeenCalledWith('body');
    expect(handleMenuOfferDeletedMock).toHaveBeenCalledWith(menuOffer);
  });

  it.each([Events.SITE_CREATED, Events.SITE_UPDATED])('should handle %s event', async (eventSource) => {
    const siteRecord = buildSQSRecord(eventSource);
    const site = siteFactory.build();
    mapSanitySiteToSiteMock.mockReturnValue(site);
    await handler({ Records: [siteRecord] });

    expect(mapSanitySiteToSiteMock).toHaveBeenCalledWith('body');
    expect(handleSiteUpdatedMock).toHaveBeenCalledWith(site);
  });

  it('should handle "site.delete" event', async () => {
    const siteRecord = buildSQSRecord(Events.SITE_DELETED);
    const site = siteFactory.build();
    mapSanitySiteToSiteMock.mockReturnValue(site);
    await handler({ Records: [siteRecord] });

    expect(mapSanitySiteToSiteMock).toHaveBeenCalledWith('body');
    expect(handleSiteDeletedMock).toHaveBeenCalledWith(site);
  });

  it.each([Events.MENU_THEMED_OFFER_CREATED, Events.MENU_THEMED_OFFER_UPDATED])(
    'should handle %s event',
    async (eventSource) => {
      const themedMenuRecord = buildSQSRecord(eventSource);
      const menu = menuFactory.build();
      const themedMenu: ThemedMenuOffer = { ...menu, menuType: MenuType.FLEXIBLE, themedMenusOffers: [] };
      mapSanityThemedMenuToThemedMenuMock.mockReturnValue(themedMenu);
      await handler({ Records: [themedMenuRecord] });
      expect(mapSanityThemedMenuToThemedMenuMock).toHaveBeenCalledWith('body');
      expect(handleMenuThemedUpdatedMock).toHaveBeenCalledWith(themedMenu);
    },
  );

  it('should handle "menu.themed.deleted" event', async () => {
    const themedMenuRecord = buildSQSRecord(Events.MENU_THEMED_OFFER_DELETED);
    const menu = menuFactory.build();
    const themedMenu: ThemedMenuOffer = { ...menu, menuType: MenuType.FLEXIBLE, themedMenusOffers: [] };
    mapSanityThemedMenuToThemedMenuMock.mockReturnValue(themedMenu);
    await handler({ Records: [themedMenuRecord] });
    expect(mapSanityThemedMenuToThemedMenuMock).toHaveBeenCalledWith('body');
    expect(handleMenuThemedDeletedMock).toHaveBeenCalledWith(themedMenu);
  });

  it('should throw error on invalid event source', async () => {
    const invalidEventSourceRecord = buildSQSRecord('random-event-source');

    await expect(handler({ Records: [invalidEventSourceRecord] })).rejects.toThrow(
      'Error processing events: [Error: Invalid event source: [random-event-source]]',
    );
  });

  function buildSQSRecord(source: string, isIntegrationTest = false): SQSRecord {
    return {
      body: JSON.stringify({
        source,
        detail: 'body',
        'detail-type': isIntegrationTest ? DetailTypes.INTEGRATION_TEST : '',
      }),
    } as unknown as SQSRecord;
  }
});
