import { StreamRecord } from 'aws-lambda';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { logger } from '@blc-mono/members/application/middleware';
import { EligibilityStatus } from '@blc-mono/members/application/models/enums/EligibilityStatus';
import { EventBusSource } from '@blc-mono/members/application/models/enums/EventBusSource';
import { MemberEvent } from '@blc-mono/members/application/models/enums/MemberEvent';
import { ApplicationModel } from '@blc-mono/members/application/models/applicationModel';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { hasAttributeChanged } from '@blc-mono/members/application/utils/dynamoDb/attibuteManagement';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export class SystemEventsService {
  constructor() {}

  // TODO: This needs implemented?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isSendProfileUpdateToSystem = (dynamoStream: StreamRecord | undefined) => {
    // TODO - confirm no triggered events sent to self for profile updates
  };

  isSendApplicationUpdateToSystem = (dynamoStream: StreamRecord | undefined) => {
    const { oldImage: oldApplication, newImage: newApplication } =
      unmarshallStreamImages<ApplicationModel>(dynamoStream);

    if (
      hasAttributeChanged('eligibilityStatus', dynamoStream) &&
      newApplication?.eligibilityStatus === EligibilityStatus.ELIGIBLE
    ) {
      if (
        newApplication?.paymentStatus?.startsWith('PAID') ||
        oldApplication?.paymentStatus?.startsWith('PAID')
      ) {
        this.sendEventBusMessage(
          EventBusSource.SYSTEM,
          MemberEvent.SYSTEM_APPLICATION_APPROVED,
          dynamoStream,
        );
      }
    } else if (
      hasAttributeChanged('paymentStatus', dynamoStream) &&
      newApplication?.paymentStatus?.startsWith('PAID')
    ) {
      if (
        newApplication?.eligibilityStatus === EligibilityStatus.ELIGIBLE ||
        oldApplication?.eligibilityStatus === EligibilityStatus.ELIGIBLE
      ) {
        this.sendEventBusMessage(
          EventBusSource.SYSTEM,
          MemberEvent.SYSTEM_APPLICATION_APPROVED,
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
