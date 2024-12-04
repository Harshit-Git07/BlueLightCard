import { Logger } from '@aws-lambda-powertools/logger';
import {
  Company as SanityCompany,
  MenuOffer as SanityMenuOffer,
  MenuThemedOffer as SanityThemedMenu,
  Offer as SanityOffer,
  Site as SanitySite,
} from '@bluelightcard/sanity-types';
import { EventBridgeEvent, SQSEvent } from 'aws-lambda';

import { handleCompanyUpdated } from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/CompanyEventHandler';
import {
  handleOfferDeleted,
  handleOfferUpdated,
} from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/OfferEventHandler';
import {
  mapSanityCompanyLocationToCompanyLocationEvent,
  SanityCompanyLocationEventBody,
} from '@blc-mono/discovery/helpers/sanityMappers/mapSanityCompanyLocationToCompanyLocation';
import { mapSanityCompanyToCompany } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityCompanyToCompany';
import { mapSanityMenuOfferToMenuOffer } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityMenuOfferToMenuOffer';
import { mapSanityOfferToOffer } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityOfferToOffer';
import { mapSanitySiteToSite } from '@blc-mono/discovery/helpers/sanityMappers/mapSanitySiteToSite';
import { mapSanityThemedMenuToThemedMenu } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityThemedMenuToThemedMenu';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';

import { handleCompanyLocationsUpdated } from './eventHandlers/CompanyLocationEventHandler';
import { handleMenusDeleted, handleMenusUpdated } from './eventHandlers/MenusEventHandler';
import { handleMenuThemedDeleted, handleMenuThemedUpdated } from './eventHandlers/MenuThemedEventHandler';
import { handleSiteDeleted, handleSiteUpdated } from './eventHandlers/SiteEventHandler';

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
        case Events.MENU_OFFER_CREATED:
        case Events.MENU_OFFER_UPDATED: {
          await handleMenusUpdated(await mapSanityMenuOfferToMenuOffer(body.detail as SanityMenuOffer));
          break;
        }
        case Events.MENU_OFFER_DELETED: {
          await handleMenusDeleted(await mapSanityMenuOfferToMenuOffer(body.detail as SanityMenuOffer));
          break;
        }
        case Events.SITE_CREATED:
        case Events.SITE_UPDATED: {
          await handleSiteUpdated(mapSanitySiteToSite(body.detail as SanitySite));
          break;
        }
        case Events.SITE_DELETED: {
          await handleSiteDeleted(mapSanitySiteToSite(body.detail as SanitySite));
          break;
        }
        case Events.MENU_THEMED_OFFER_CREATED:
        case Events.MENU_THEMED_OFFER_UPDATED: {
          await handleMenuThemedUpdated(mapSanityThemedMenuToThemedMenu(body.detail as SanityThemedMenu));
          break;
        }
        case Events.MENU_THEMED_OFFER_DELETED: {
          await handleMenuThemedDeleted(mapSanityThemedMenuToThemedMenu(body.detail as SanityThemedMenu));
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
