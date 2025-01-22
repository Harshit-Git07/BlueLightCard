import { EventBridgeEvent, StreamRecord } from 'aws-lambda';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { eventBusMiddleware, logger } from '../../middleware';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { hasAttributeChanged } from '@blc-mono/members/application/utils/dynamoDb/attibuteManagement';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export const unwrappedHandler = async (
  event: EventBridgeEvent<string, StreamRecord>,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_LEGACY) !== 'true') {
    return;
  }

  const dynamoStream: StreamRecord = event.detail;

  switch (event['detail-type']) {
    case MemberEvent.LEGACY_USER_PROFILE_CREATED: {
      const { newImage: newProfile } = unmarshallStreamImages<ProfileModel>(dynamoStream);
      sendLegacyProfileCreated(newProfile);
      break;
    }
    case MemberEvent.LEGACY_USER_PROFILE_UPDATED:
      isSendLegacyProfileUpdated(dynamoStream);
      break;
    case MemberEvent.LEGACY_USER_APPLICATION_CREATED: {
      const { newImage: newApplication } = unmarshallStreamImages<ApplicationModel>(dynamoStream);
      sendLegacyApplicationCreated(newApplication);
      break;
    }
    case MemberEvent.LEGACY_USER_APPLICATION_UPDATED:
      isSendLegacyApplicationUpdated(dynamoStream);
      break;
    case MemberEvent.LEGACY_USER_CARD_CREATED: {
      const { newImage: newCard } = unmarshallStreamImages<CardModel>(dynamoStream);
      sendLegacyCardCreated(newCard);
      break;
    }
    case MemberEvent.LEGACY_USER_CARD_UPDATED:
      isSendLegacyCardUpdated(dynamoStream);
      break;
    case MemberEvent.LEGACY_USER_GDPR_REQUESTED:
    case MemberEvent.LEGACY_USER_ANON_REQUESTED:
      // TODO GDPR and ANON actions
      // eb source: user.gdpr.requested
      break;
  }
};

function sendLegacyProfileCreated(profile: ProfileModel | undefined): void {
  const payload = {
    uuid: profile?.memberId,
    brand: getEnv(MemberStackEnvironmentKeys.BRAND),
    dob: profile?.dateOfBirth,
    gender: profile?.gender,
    mobile: profile?.phoneNumber,
    firstname: profile?.firstName,
    surname: profile?.lastName,
    employer: profile?.employerId,
    employer_id: profile?.employerId,
    organisation: profile?.organisationId,
    email: profile?.email,
    email_validated: profile?.emailValidated ? 1 : 0,
    spare_email: profile?.spareEmail,
    spare_email_validated: profile?.spareEmailValidated ? 1 : 0,
    ga_key: profile?.gaKey,
    merged_time: '',
    merged_uid: 0,
  };

  sendEventBusMessage('user.profile.updated', `${payload.brand} User profile updated`, payload);
}

function isSendLegacyProfileUpdated(dynamoStream: StreamRecord | undefined): void {
  const { newImage: newProfile } = unmarshallStreamImages<ProfileModel>(dynamoStream);

  const payloadProfile: Record<string, unknown> = {};
  payloadProfile.uuid = newProfile?.memberId;
  payloadProfile.brand = getEnv(MemberStackEnvironmentKeys.BRAND);

  if (hasAttributeChanged('dateOfBirth', dynamoStream)) {
    payloadProfile.dob = newProfile?.dateOfBirth;
  }

  if (hasAttributeChanged('gender', dynamoStream)) {
    payloadProfile.gender = newProfile?.gender;
  }

  if (hasAttributeChanged('phoneNumber', dynamoStream)) {
    payloadProfile.mobile = newProfile?.phoneNumber;
  }

  if (hasAttributeChanged('firstName', dynamoStream)) {
    payloadProfile.firstname = newProfile?.firstName;
  }

  if (hasAttributeChanged('lastName', dynamoStream)) {
    payloadProfile.surname = newProfile?.lastName;
  }

  if (hasAttributeChanged('organisationId', dynamoStream)) {
    payloadProfile.organisation = newProfile?.organisationId;
  }

  if (hasAttributeChanged('employerId', dynamoStream)) {
    payloadProfile.employer = newProfile?.employerId;
  }

  if (hasAttributeChanged('email', dynamoStream)) {
    payloadProfile.email = newProfile?.email;
  }

  if (hasAttributeChanged('emailValidated', dynamoStream)) {
    payloadProfile.email_validated = newProfile?.emailValidated;
  }

  if (hasAttributeChanged('spareEmail', dynamoStream)) {
    payloadProfile.spare_email = newProfile?.spareEmail;
  }

  if (hasAttributeChanged('spareEmailValidated', dynamoStream)) {
    payloadProfile.spare_email_validated = newProfile?.spareEmailValidated;
  }

  sendEventBusMessage(
    'user.profile.updated',
    payloadProfile.brand + ' User profile updated',
    payloadProfile,
  );

  if (hasAttributeChanged('lastName', dynamoStream)) {
    const payloadSurname: Record<string, unknown> = {};
    payloadSurname.uuid = newProfile?.memberId;
    payloadSurname.brand = 'BLC_UK';
    payloadSurname.surname = newProfile?.lastName;
    sendEventBusMessage(
      'user.surname.updated',
      `${payloadSurname.brand} User Surname updated`,
      payloadProfile,
    );
  }

  if (hasAttributeChanged('status', dynamoStream)) {
    const payloadStatus: Record<string, unknown> = {};
    payloadStatus.uuid = newProfile?.memberId;
    payloadStatus.brand = 'BLC_UK';
    payloadStatus.cardNumber = null;
    payloadStatus.userStatus = newProfile?.status;

    sendEventBusMessage(
      'user.status.updated',
      `${payloadStatus.brand} User Status updated`,
      payloadProfile,
    );
  }
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sendLegacyApplicationCreated(application: ApplicationModel | undefined): void {
  // TODO - All legacy card stuff (idupload, promo use etc) needs card number, but we dont have card number at this point... so dont send anything..?
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isSendLegacyApplicationUpdated(dynamoStream: StreamRecord | undefined): void {
  // TODO - All legacy card stuff (idupload, promo use etc) needs card number, but we dont have card number at this point... so dont send anything..?
}

function sendLegacyCardCreated(card: CardModel | undefined): void {
  const payload = {
    uuid: card?.memberId,
    brand: getEnv(MemberStackEnvironmentKeys.BRAND),
    cardNumber: card?.cardNumber,
    cardStatus: getLegacyCardStatus(card?.cardStatus, card?.paymentStatus),
    expires: card?.expiryDate,
  };

  sendEventBusMessage('user.card.status.created', `${payload.brand} User Card Created`, payload);
}

function isSendLegacyCardUpdated(dynamoStream: StreamRecord | undefined): void {
  const { newImage: newCard } = unmarshallStreamImages<CardModel>(dynamoStream);

  const payload: Record<string, unknown> = {};
  payload.uuid = newCard?.memberId;
  payload.brand = getEnv(MemberStackEnvironmentKeys.BRAND);

  if (hasAttributeChanged('cardStatus', dynamoStream)) {
    payload.cardStatus = getLegacyCardStatus(newCard?.cardStatus, newCard?.paymentStatus);
  }

  if (hasAttributeChanged('expiryDate', dynamoStream)) {
    payload.expires = newCard?.expiryDate;
  }

  if (hasAttributeChanged('postedDate', dynamoStream)) {
    payload.posted = newCard?.postedDate;
  }

  sendEventBusMessage('user.card.status.updated', `${payload.brand} User Card Updated`, payload);
}

function sendEventBusMessage(source: string, messageType: string, payload: object): void {
  const client = new EventBridgeClient();
  client
    .send(
      new PutEventsCommand({
        Entries: [
          {
            Detail: JSON.stringify(payload),
            DetailType: messageType,
            Resources: [],
            Source: source,
            EventBusName: getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENT_BUS_NAME),
          },
        ],
      }),
    )
    .catch((err) => {
      logger.error(err);
    });
}

function getLegacyCardStatus(
  cardStatus: CardStatus | undefined,
  paymentStatus: PaymentStatus | undefined,
): number {
  if (paymentStatus !== undefined) {
    switch (paymentStatus) {
      case PaymentStatus.PENDING_REFUND:
        return 12;
      case PaymentStatus.REFUNDED:
        return 13;
    }
  }

  switch (cardStatus) {
    case CardStatus.AWAITING_BATCHING:
      return 3;
    case CardStatus.ADDED_TO_BATCH:
      return 4;
    case CardStatus.AWAITING_POSTAGE:
      return 5;
    case CardStatus.PHYSICAL_CARD:
      return 6;
    case CardStatus.VIRTUAL_CARD:
      return 6;
    case CardStatus.CARD_LOST:
      return 8;
    case CardStatus.DISABLED:
      return 9;
    case CardStatus.CARD_EXPIRED:
      return 10;
    default:
      return 3;
  }
}

export const handler = eventBusMiddleware(unwrappedHandler);
