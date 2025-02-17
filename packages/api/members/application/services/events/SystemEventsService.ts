import { StreamRecord } from 'aws-lambda';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { EventBusSource } from '@blc-mono/shared/models/members/enums/EventBusSource';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { hasAttributeChanged } from '@blc-mono/members/application/services/events/utils/attibuteManagement';
import { EventsService } from '@blc-mono/members/application/services/events/base/EventsService';

let systemEventsServiceSingleton: SystemEventsService;

export class SystemEventsService extends EventsService {
  constructor() {
    super(EventBusSource.SYSTEM);
  }

  // TODO: This needs implemented?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async emitProfileUpdatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    // TODO - confirm no triggered events sent to self for profile updates
  }

  public async emitApplicationUpdatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
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
        await this.sendEventBusMessage(MemberEvent.SYSTEM_APPLICATION_APPROVED, dynamoStream);
      }
    } else if (
      hasAttributeChanged('paymentStatus', dynamoStream) &&
      newApplication?.paymentStatus?.startsWith('PAID')
    ) {
      if (
        newApplication?.eligibilityStatus === EligibilityStatus.ELIGIBLE ||
        oldApplication?.eligibilityStatus === EligibilityStatus.ELIGIBLE
      ) {
        await this.sendEventBusMessage(MemberEvent.SYSTEM_APPLICATION_APPROVED, dynamoStream);
      }
    }
  }
}

export function systemEventsService(): SystemEventsService {
  if (!systemEventsServiceSingleton) {
    systemEventsServiceSingleton = new SystemEventsService();
  }

  return systemEventsServiceSingleton;
}
