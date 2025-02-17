import { StreamRecord } from 'aws-lambda';
import { EventBusSource } from '@blc-mono/shared/models/members/enums/EventBusSource';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { hasAttributeChanged } from '@blc-mono/members/application/services/events/utils/attibuteManagement';
import { EventsService } from '@blc-mono/members/application/services/events/base/EventsService';

let dataWarehouseEventsServiceSingleton: DataWarehouseEventsService;

export class DataWarehouseEventsService extends EventsService {
  constructor() {
    super(EventBusSource.DWH);
  }

  public async emitProfileCreatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    await this.sendEventBusMessage(MemberEvent.DWH_PROFILE_CREATED, dynamoStream);
  }

  public async emitApplicationCreatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    await this.sendEventBusMessage(MemberEvent.DWH_APPLICATION_CREATED, dynamoStream);
  }

  public async emitCardCreatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    await this.sendEventBusMessage(MemberEvent.DWH_CARD_CREATED, dynamoStream);
  }

  public async emitProfileUpdatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
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
      await this.sendEventBusMessage(MemberEvent.DWH_PROFILE_UPDATED, dynamoStream);
    }
  }

  public async emitApplicationUpdatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    if (
      hasAttributeChanged('eligibilityStatus', dynamoStream) ||
      hasAttributeChanged('paymentStatus', dynamoStream) ||
      hasAttributeChanged('promoCode', dynamoStream) ||
      hasAttributeChanged('idS3LocationPrimary', dynamoStream) ||
      hasAttributeChanged('idS3LocationSecondary', dynamoStream)
    ) {
      await this.sendEventBusMessage(MemberEvent.DWH_APPLICATION_UPDATED, dynamoStream);
    }
  }

  public async emitCardUpdatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    if (
      hasAttributeChanged('expiryDate', dynamoStream) ||
      hasAttributeChanged('cardStatus', dynamoStream) ||
      hasAttributeChanged('paymentStatus', dynamoStream)
    ) {
      await this.sendEventBusMessage(MemberEvent.DWH_CARD_UPDATED, dynamoStream);
    }
  }
}

export function dataWarehouseEventsService(): DataWarehouseEventsService {
  if (!dataWarehouseEventsServiceSingleton) {
    dataWarehouseEventsServiceSingleton = new DataWarehouseEventsService();
  }

  return dataWarehouseEventsServiceSingleton;
}
