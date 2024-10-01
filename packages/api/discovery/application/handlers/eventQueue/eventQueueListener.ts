import { Logger } from '@aws-lambda-powertools/logger';
import { EventBridgeEvent, SQSEvent } from 'aws-lambda';

import { handleCompanyUpdated } from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/CompanyEventHandler';
import {
  handleOfferDeleted,
  handleOfferUpdated,
} from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/OfferEventHandler';
import { mapSanityCompanyToCompany } from '@blc-mono/discovery/helpers/mapSanityCompanyToCompany';
import { mapSanityOfferToOffer } from '@blc-mono/discovery/helpers/mapSanityOfferToOffer';
import { Events } from '@blc-mono/discovery/infrastructure/eventHandling/events';

import { Company as SanityCompany, Offer as SanityOffer } from '../../models/SanityTypes';

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
        default:
          logger.error(`Invalid event source: [${body.source}]`);
          throw new Error(`Invalid event source: [${body.source}]`);
      }
    } catch (error) {
      logger.error({ message: 'Error processing event', error });
      throw new Error(`Error processing events: [${error}]`);
    }
  }
};

export const handler = unwrappedHandler;
