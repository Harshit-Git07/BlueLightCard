import { StreamRecord } from 'aws-lambda';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { logger } from '@blc-mono/members/application/middleware';
import { CardStatus } from '@blc-mono/members/application/models/enums/CardStatus';
import { EligibilityStatus } from '@blc-mono/members/application/models/enums/EligibilityStatus';
import { EventBusSource } from '@blc-mono/members/application/models/enums/EventBusSource';
import { MemberEvent } from '@blc-mono/members/application/models/enums/MemberEvent';
import { PaymentStatus } from '@blc-mono/members/application/models/enums/PaymentStatus';
import { ApplicationModel } from '@blc-mono/members/application/models/applicationModel';
import { CardModel } from '@blc-mono/members/application/models/cardModel';
import { hasAttributeChanged } from '@blc-mono/members/application/utils/dynamoDb/attibuteManagement';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export class BrazeEventsService {
  constructor() {}

  isSendProfileCreateToBraze = (dynamoStream: StreamRecord | undefined) => {
    this.sendEventBusMessage(EventBusSource.BRAZE, MemberEvent.BRAZE_PROFILE_CREATED, dynamoStream);
  };

  isSendProfileUpdateToBraze = (dynamoStream: StreamRecord | undefined) => {
    if (
      hasAttributeChanged('firstName', dynamoStream) ||
      hasAttributeChanged('lastName', dynamoStream) ||
      hasAttributeChanged('dateOfBirth', dynamoStream) ||
      hasAttributeChanged('gender', dynamoStream) ||
      hasAttributeChanged('phoneNumber', dynamoStream) ||
      hasAttributeChanged('county', dynamoStream) ||
      hasAttributeChanged('email', dynamoStream) ||
      hasAttributeChanged('organisationId', dynamoStream) ||
      hasAttributeChanged('employerId', dynamoStream)
    ) {
      this.sendEventBusMessage(
        EventBusSource.BRAZE,
        MemberEvent.BRAZE_PROFILE_UPDATED,
        dynamoStream,
      );
    }
  };

  isSendApplicationCreateToBraze = (dynamoStream: StreamRecord | undefined) => {
    this.sendEventBusMessage(
      EventBusSource.BRAZE,
      MemberEvent.BRAZE_APPLICATION_CREATED,
      dynamoStream,
    );
  };

  isSendApplicationUpdateToBraze = (dynamoStream: StreamRecord | undefined) => {
    const { oldImage: oldApplication, newImage: newApplication } =
      unmarshallStreamImages<ApplicationModel>(dynamoStream);

    if (
      hasAttributeChanged('eligibilityStatus', dynamoStream) &&
      newApplication?.eligibilityStatus == EligibilityStatus.ELIGIBLE
    ) {
      this.sendEventBusMessage(
        EventBusSource.BRAZE,
        MemberEvent.BRAZE_APPLICATION_UPDATED,
        dynamoStream,
      );
    }

    if (
      hasAttributeChanged('paymentStatus', dynamoStream) &&
      newApplication?.paymentStatus?.startsWith('PAID')
    ) {
      this.sendEventBusMessage(
        EventBusSource.BRAZE,
        MemberEvent.BRAZE_APPLICATION_UPDATED,
        dynamoStream,
      );
    }
  };

  isSendCardCreateToBraze = (dynamoStream: StreamRecord | undefined) => {
    this.sendEventBusMessage(EventBusSource.BRAZE, MemberEvent.BRAZE_CARD_CREATED, dynamoStream);
  };

  isSendCardUpdateToBraze = (dynamoStream: StreamRecord | undefined) => {
    const { oldImage: oldCard, newImage: newCard } =
      unmarshallStreamImages<CardModel>(dynamoStream);

    if (
      hasAttributeChanged('cardStatus', dynamoStream) &&
      (newCard?.cardStatus == CardStatus.AWAITING_POSTAGE ||
        newCard?.cardStatus == CardStatus.PHYSICAL_CARD ||
        newCard?.cardStatus == CardStatus.CARD_LOST ||
        newCard?.cardStatus == CardStatus.DISABLED ||
        newCard?.cardStatus == CardStatus.CARD_EXPIRED)
    ) {
      this.sendEventBusMessage(EventBusSource.BRAZE, MemberEvent.BRAZE_CARD_UPDATED, dynamoStream);
    }

    if (hasAttributeChanged('expiryDate', dynamoStream)) {
      this.sendEventBusMessage(EventBusSource.BRAZE, MemberEvent.BRAZE_CARD_UPDATED, dynamoStream);
    }

    if (hasAttributeChanged('paymentStatus', dynamoStream)) {
      if (newCard?.paymentStatus == PaymentStatus.REFUNDED) {
        this.sendEventBusMessage(
          EventBusSource.BRAZE,
          MemberEvent.BRAZE_CARD_UPDATED,
          dynamoStream,
        );
      }
    }
  };

  sendEventBusMessage = (
    source: string,
    messageType: string,
    dynamoStream: StreamRecord | undefined,
  ) => {
    const events = new PutEventsCommand({
      Entries: [
        {
          Detail: JSON.stringify(dynamoStream),
          DetailType: messageType,
          Resources: [],
          Source: source,
          EventBusName: getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENT_BUS_NAME),
        },
      ],
    });

    const client = new EventBridgeClient({});
    client.send(events).catch((err) => {
      logger.error(err);
    });
  };
}
