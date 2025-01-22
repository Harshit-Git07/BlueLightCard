import { StreamRecord } from 'aws-lambda';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { logger } from '@blc-mono/members/application/middleware';
import { EventBusSource } from '@blc-mono/shared/models/members/enums/EventBusSource';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { hasAttributeChanged } from '@blc-mono/members/application/utils/dynamoDb/attibuteManagement';

export class LegacyEventsService {
  constructor() {}

  isSendProfileCreateToLegacy = (dynamoStream: StreamRecord | undefined) => {
    this.sendEventBusMessage(
      EventBusSource.LEGACY,
      MemberEvent.LEGACY_USER_PROFILE_CREATED,
      dynamoStream,
    );
  };

  isSendProfileUpdateToLegacy = (dynamoStream: StreamRecord | undefined) => {
    if (
      hasAttributeChanged('dateOfBirth', dynamoStream) ||
      hasAttributeChanged('gender', dynamoStream) ||
      hasAttributeChanged('phoneNumber', dynamoStream) ||
      hasAttributeChanged('email', dynamoStream) ||
      hasAttributeChanged('spareEmail', dynamoStream) ||
      hasAttributeChanged('emailValidated', dynamoStream) ||
      hasAttributeChanged('spareEmailValidated', dynamoStream) ||
      hasAttributeChanged('county', dynamoStream) ||
      hasAttributeChanged('status', dynamoStream) ||
      hasAttributeChanged('organisationId', dynamoStream) ||
      hasAttributeChanged('employerId', dynamoStream)
    ) {
      this.sendEventBusMessage(
        EventBusSource.LEGACY,
        MemberEvent.LEGACY_USER_PROFILE_UPDATED,
        dynamoStream,
      );
    }
  };

  isSendCardCreateToLegacy = (dynamoStream: StreamRecord | undefined) => {
    this.sendEventBusMessage(
      EventBusSource.LEGACY,
      MemberEvent.LEGACY_USER_CARD_CREATED,
      dynamoStream,
    );
  };

  isSendCardUpdateToLegacy = (dynamoStream: StreamRecord | undefined) => {
    if (
      hasAttributeChanged('expiryDate', dynamoStream) ||
      hasAttributeChanged('cardStatus', dynamoStream) ||
      hasAttributeChanged('postedDate', dynamoStream)
    ) {
      this.sendEventBusMessage(
        EventBusSource.LEGACY,
        MemberEvent.LEGACY_USER_CARD_CREATED,
        dynamoStream,
      );
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
