import { Logger } from '@aws-lambda-powertools/logger';
import {
  Company as SanityCompany,
  Event as SanityEvent,
  MenuDealsOfTheWeek as SanityMenuDealsOfTheWeek,
  MenuFeaturedOffers as SanityMenuFeaturedOffers,
  MenuMarketplace as SanityMenuMarketplace,
  MenuThemedEvent as SanityEventThemedMenu,
  MenuThemedOffer as SanityThemedMenu,
  MenuWaysToSave as SanityMenuWaysToSave,
  Offer as SanityOffer,
} from '@bluelightcard/sanity-types';
import { EventBridgeEvent, SQSEvent } from 'aws-lambda';

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
import {
  mapSanityCompanyLocationToCompanyLocationEvent,
  SanityCompanyLocationEventBody,
} from '@blc-mono/discovery/helpers/sanityMappers/mapSanityCompanyLocationToCompanyLocation';
import { mapSanityCompanyToCompany } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityCompanyToCompany';
import { mapSanityEventThemedMenuToEventThemedMenu } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityEventThemedMenuToEventThemedMenu';
import { mapSanityEventToEventOffer } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityEventToEvent';
import { mapSanityMarketPlaceMenusToMenuOffers } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityMarketplaceMenusToMenus';
import { mapSanityMenuOfferToMenuOffer } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityMenuOfferToMenuOffer';
import { mapSanityOfferToOffer } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityOfferToOffer';
import { mapSanityThemedMenuToThemedMenu } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityThemedMenuToThemedMenu';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';

import { handleCompanyLocationsUpdated } from './eventHandlers/CompanyLocationEventHandler';
import { handleMarketplaceMenusDeleted, handleMarketplaceMenusUpdated } from './eventHandlers/MarketplaceEventHandler';
import { handleMenusDeleted, handleMenusUpdated } from './eventHandlers/MenusEventHandler';
import { handleMenuThemedDeleted, handleMenuThemedUpdated } from './eventHandlers/MenuThemedEventHandler';

const logger = new Logger({ serviceName: 'event-queue-listener' });

const unwrappedHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body) as EventBridgeEvent<never, never>;

    try {
      switch (body.source) {
        case Events.OFFER_CREATED:
        case Events.OFFER_UPDATED:
          await handleOfferUpdated(mapSanityOfferToOffer(body.detail as SanityOffer));
          break;
        case Events.EVENT_CREATED:
        case Events.EVENT_UPDATED:
          await handleEventOfferUpdated(mapSanityEventToEventOffer(body.detail as SanityEvent));
          break;
        case Events.EVENT_DELETED:
          await handleEventOfferDeleted(mapSanityEventToEventOffer(body.detail as SanityEvent));
          break;
        case Events.OFFER_DELETED:
          await handleOfferDeleted(mapSanityOfferToOffer(body.detail as SanityOffer));
          break;
        case Events.COMPANY_CREATED:
        case Events.COMPANY_UPDATED:
          await handleCompanyUpdated(mapSanityCompanyToCompany(body.detail as SanityCompany));
          break;
        case Events.COMPANY_LOCATION_BATCH_CREATED:
        case Events.COMPANY_LOCATION_BATCH_UPDATED:
          await handleCompanyLocationsUpdated(
            mapSanityCompanyLocationToCompanyLocationEvent(body.detail as SanityCompanyLocationEventBody),
          );
          break;
        case Events.MARKETPLACE_MENUS_CREATED:
        case Events.MARKETPLACE_MENUS_UPDATED:
          await handleMarketplaceMenusUpdated(
            mapSanityMarketPlaceMenusToMenuOffers(body.detail as SanityMenuMarketplace),
          );
          break;
        case Events.MARKETPLACE_MENUS_DELETED:
          await handleMarketplaceMenusDeleted(
            mapSanityMarketPlaceMenusToMenuOffers(body.detail as SanityMenuMarketplace),
          );
          break;
        case Events.DEALS_OF_THE_WEEK_CREATED:
        case Events.DEALS_OF_THE_WEEK_UPDATED:
        case Events.FEATURED_CREATED:
        case Events.FEATURED_UPDATED: {
          await handleMenusUpdated(
            mapSanityMenuOfferToMenuOffer(body.detail as SanityMenuDealsOfTheWeek | SanityMenuFeaturedOffers),
          );
          break;
        }
        case Events.FEATURED_DELETED:
        case Events.DEALS_OF_THE_WEEK_DELETED: {
          await handleMenusDeleted(
            mapSanityMenuOfferToMenuOffer(body.detail as SanityMenuDealsOfTheWeek | SanityMenuFeaturedOffers),
          );
          break;
        }
        case Events.WAYS_TO_SAVE_CREATED:
        case Events.WAYS_TO_SAVE_UPDATED:
        case Events.MENU_THEMED_OFFER_CREATED:
        case Events.MENU_THEMED_OFFER_UPDATED: {
          await handleMenuThemedUpdated(
            mapSanityThemedMenuToThemedMenu(body.detail as SanityThemedMenu | SanityMenuWaysToSave),
          );
          break;
        }
        case Events.MENU_THEMED_EVENT_CREATED:
        case Events.MENU_THEMED_EVENT_UPDATED: {
          await handleEventMenuThemedUpdated(
            mapSanityEventThemedMenuToEventThemedMenu(body.detail as SanityEventThemedMenu),
          );
          break;
        }
        case Events.WAYS_TO_SAVE_DELETED:
        case Events.MENU_THEMED_OFFER_DELETED: {
          await handleMenuThemedDeleted(
            mapSanityThemedMenuToThemedMenu(body.detail as SanityThemedMenu | SanityMenuWaysToSave),
          );
          break;
        }
        case Events.MENU_THEMED_EVENT_DELETED: {
          await handleEventMenuThemedDeleted(
            mapSanityEventThemedMenuToEventThemedMenu(body.detail as SanityEventThemedMenu),
          );
          break;
        }
        default:
          logger.error(`Invalid event source: [${body.source}]`);
          throw new Error(`Invalid event source: [${body.source}]`);
      }
    } catch (error) {
      logger.error({ message: `Error processing event`, error, event: JSON.stringify(body.detail) });
      throw new Error(`Error processing events: [${error}]`);
    }
  }
};

export const handler = unwrappedHandler;
