import { StreamRecord } from 'aws-lambda';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { logger } from '@blc-mono/members/application/middleware';
import { EventBusSource } from '@blc-mono/shared/models/members/enums/EventBusSource';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { hasAttributeChanged } from '@blc-mono/members/application/utils/dynamoDb/attibuteManagement';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export class DwhEventsService {
  constructor() {}

  isSendProfileCreateToDwh = (dynamoStream: StreamRecord | undefined) => {
    this.sendEventBusMessage(EventBusSource.DWH, MemberEvent.DWH_PROFILE_CREATED, dynamoStream);
  };

  isSendProfileUpdateToDwh = (dynamoStream: StreamRecord | undefined) => {
    if (
      hasAttributeChanged('dateOfBirth', dynamoStream) ||
      hasAttributeChanged('gender', dynamoStream) ||
      hasAttributeChanged('phoneNumber', dynamoStream) ||
      hasAttributeChanged('lastIpAddress', dynamoStream) ||
      hasAttributeChanged('lastBrowser', dynamoStream) ||
      hasAttributeChanged('lastLogin', dynamoStream) ||
      hasAttributeChanged('email', dynamoStream) ||
      hasAttributeChanged('spareEmail', dynamoStream) ||
      hasAttributeChanged('emailValidated', dynamoStream) ||
      hasAttributeChanged('spareEmailValidated', dynamoStream) ||
      hasAttributeChanged('county', dynamoStream) ||
      hasAttributeChanged('status', dynamoStream) ||
      hasAttributeChanged('organisationId', dynamoStream) ||
      hasAttributeChanged('employerId', dynamoStream)
    ) {
      this.sendEventBusMessage(EventBusSource.DWH, MemberEvent.DWH_PROFILE_UPDATED, dynamoStream);
    }
  };

  isSendApplicationCreateToDwh = (dynamoStream: StreamRecord | undefined) => {
    this.sendEventBusMessage(EventBusSource.DWH, MemberEvent.DWH_APPLICATION_CREATED, dynamoStream);
  };

  isSendApplicationUpdateToDwh = (dynamoStream: StreamRecord | undefined) => {
    if (
      hasAttributeChanged('eligibilityStatus', dynamoStream) ||
      hasAttributeChanged('paymentStatus', dynamoStream) ||
      hasAttributeChanged('promoCode', dynamoStream) ||
      hasAttributeChanged('idS3LocationPrimary', dynamoStream) ||
      hasAttributeChanged('idS3LocationSecondary', dynamoStream)
    ) {
      this.sendEventBusMessage(
        EventBusSource.DWH,
        MemberEvent.DWH_APPLICATION_UPDATED,
        dynamoStream,
      );
    }
  };

  isSendCardCreateToDwh = (dynamoStream: StreamRecord | undefined) => {
    this.sendEventBusMessage(EventBusSource.DWH, MemberEvent.DWH_CARD_CREATED, dynamoStream);
  };

  isSendCardUpdateToDwh = (dynamoStream: StreamRecord | undefined) => {
    if (
      hasAttributeChanged('expiryDate', dynamoStream) ||
      hasAttributeChanged('cardStatus', dynamoStream) ||
      hasAttributeChanged('paymentStatus', dynamoStream)
    ) {
      this.sendEventBusMessage(EventBusSource.DWH, MemberEvent.DWH_CARD_UPDATED, dynamoStream);
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
