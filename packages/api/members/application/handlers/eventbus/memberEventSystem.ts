import { EventBridgeEvent, StreamRecord } from 'aws-lambda';
import { eventBusMiddleware, logger } from '../../middleware';
import { v4 as uuidv4 } from 'uuid';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import {
  ApplicationModel,
  UpdateApplicationModel,
} from '@blc-mono/shared/models/members/applicationModel';
import { CreateCardModel } from '@blc-mono/shared/models/members/cardModel';
import { cardService } from '@blc-mono/members/application/services/cardService';
import { profileService } from '@blc-mono/members/application/services/profileService';
import { applicationService } from '@blc-mono/members/application/services/applicationService';

export const unwrappedHandler = async (
  event: EventBridgeEvent<string, StreamRecord>,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_SYSTEM) !== 'true') {
    logger.info({ message: 'System events disabled, skipping...' });
    return;
  }

  switch (event['detail-type']) {
    case MemberEvent.SYSTEM_APPLICATION_APPROVED: {
      const application = unmarshallStreamImages<ApplicationModel>(event.detail).newImage;

      if (application === undefined) {
        logger.error({
          message: 'Undefined application when application expected on system event',
        });
        return;
      }

      const cardNumber = await getNextCardNumber();
      const nameForCard = await getNameForCard(application.memberId);

      await createCard(application, cardNumber, nameForCard);
      await updateApplication(application, cardNumber);

      break;
    }
    case MemberEvent.SYSTEM_APPLICATION_PAYMENT:
      // TODO - pending payments team to finalise stripe callback method for payment updates
      // system triggered payment notification (from payment subsystem? tbc)
      break;
  }
};

async function getNextCardNumber(): Promise<string> {
  // TODO - confirm card number creation algorithm - mm-540 - uuid for now...
  return uuidv4();
}

async function getNameForCard(memberId: string): Promise<string> {
  const profile = await profileService().getProfile(memberId);
  return `${profile.firstName} ${profile.lastName}`;
}

async function createCard(
  application: ApplicationModel,
  cardNumber: string,
  nameForCard: string,
): Promise<void> {
  const card: CreateCardModel = {
    nameOnCard: nameForCard,
    purchaseDate: application.purchaseDate,
    paymentStatus: application.paymentStatus,
  };

  return await cardService().createCard(application.memberId, cardNumber, card);
}

async function updateApplication(application: ApplicationModel, cardNumber: string): Promise<void> {
  const updatedApplication: UpdateApplicationModel = {
    cardNumber: cardNumber,
  };

  return await applicationService().updateApplication(
    application.memberId,
    application.applicationId,
    updatedApplication,
  );
}

export const handler = eventBusMiddleware(unwrappedHandler);
