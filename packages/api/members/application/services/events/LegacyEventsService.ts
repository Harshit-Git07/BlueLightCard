import { StreamRecord } from 'aws-lambda';
import { EventBusSource } from '@blc-mono/shared/models/members/enums/EventBusSource';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { hasAttributeChanged } from '@blc-mono/members/application/services/events/utils/attibuteManagement';
import { EventsService } from '@blc-mono/members/application/services/events/base/EventsService';

let legacyEventsServiceSingleton: LegacyEventsService;

export class LegacyEventsService extends EventsService {
  constructor() {
    super(EventBusSource.LEGACY);
  }

  public async emitProfileCreatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    await this.sendEventBusMessage(MemberEvent.LEGACY_USER_PROFILE_CREATED, dynamoStream);
  }

  public async emitCardCreatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    await this.sendEventBusMessage(MemberEvent.LEGACY_USER_CARD_CREATED, dynamoStream);
  }

  public async emitProfileUpdatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
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
      await this.sendEventBusMessage(MemberEvent.LEGACY_USER_PROFILE_UPDATED, dynamoStream);
    }
  }

  public async emitCardUpdatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    if (
      hasAttributeChanged('expiryDate', dynamoStream) ||
      hasAttributeChanged('cardStatus', dynamoStream) ||
      hasAttributeChanged('postedDate', dynamoStream)
    ) {
      await this.sendEventBusMessage(MemberEvent.LEGACY_USER_CARD_UPDATED, dynamoStream);
    }
  }
}

export function legacyEventsService(): LegacyEventsService {
  if (!legacyEventsServiceSingleton) {
    legacyEventsServiceSingleton = new LegacyEventsService();
  }

  return legacyEventsServiceSingleton;
}
