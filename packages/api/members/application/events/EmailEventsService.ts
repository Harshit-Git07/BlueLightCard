import { StreamRecord } from 'aws-lambda';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { logger } from '@blc-mono/members/application/middleware';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { EventBusSource } from '@blc-mono/shared/models/members/enums/EventBusSource';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { hasAttributeChanged } from '@blc-mono/members/application/utils/dynamoDb/attibuteManagement';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export class EmailEventsService {
  constructor() {}

  isSendProfileCreateToEmail = (dynamoStream: StreamRecord | undefined) => {
    this.sendEventBusMessage(EventBusSource.EMAIL, MemberEvent.EMAIL_SIGNUP, dynamoStream);
  };

  isSendApplicationUpdateToEmail = (dynamoStream: StreamRecord | undefined) => {
    const { newImage: newApplication } = unmarshallStreamImages<ApplicationModel>(dynamoStream);

    if (hasAttributeChanged('trustedDomainEmail', dynamoStream)) {
      this.sendEventBusMessage(
        EventBusSource.EMAIL,
        MemberEvent.EMAIL_TRUSTED_DOMAIN,
        dynamoStream,
      );
    }

    if (
      hasAttributeChanged('eligibilityStatus', dynamoStream) &&
      newApplication?.eligibilityStatus === EligibilityStatus.ELIGIBLE
    ) {
      this.sendEventBusMessage(
        EventBusSource.EMAIL,
        MemberEvent.EMAIL_MEMBERSHIP_LIVE,
        dynamoStream,
      );
    }

    if (
      hasAttributeChanged('paymentStatus', dynamoStream) &&
      newApplication?.paymentStatus === PaymentStatus.PAID_PROMO_CODE
    ) {
      this.sendEventBusMessage(EventBusSource.EMAIL, MemberEvent.EMAIL_PROMO_PAYMENT, dynamoStream);
    }

    if (
      hasAttributeChanged('paymentStatus', dynamoStream) &&
      (newApplication?.paymentStatus === PaymentStatus.PAID_CARD ||
        newApplication?.paymentStatus === PaymentStatus.PAID_PAYPAL ||
        newApplication?.paymentStatus === PaymentStatus.PAID_CHEQUE ||
        newApplication?.paymentStatus === PaymentStatus.PAID_ADMIN)
    ) {
      this.sendEventBusMessage(EventBusSource.EMAIL, MemberEvent.EMAIL_PAYMENT_MADE, dynamoStream);
    }
  };

  isSendCardCreateToEmail = (dynamoStream: StreamRecord | undefined) => {
    this.sendEventBusMessage(EventBusSource.EMAIL, MemberEvent.EMAIL_CARD_CREATED, dynamoStream);
  };

  isSendCardUpdateToEmail = (dynamoStream: StreamRecord | undefined) => {
    const { newImage: newCard } = unmarshallStreamImages<CardModel>(dynamoStream);

    if (
      hasAttributeChanged('cardStatus', dynamoStream) &&
      newCard?.cardStatus === CardStatus.PHYSICAL_CARD
    ) {
      this.sendEventBusMessage(EventBusSource.EMAIL, MemberEvent.EMAIL_CARD_POSTED, dynamoStream);
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
