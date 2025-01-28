import { EventBridgeEvent, StreamRecord } from 'aws-lambda';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { eventBusMiddleware, logger } from '../../middleware';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { hasAttributeChanged } from '@blc-mono/members/application/utils/dynamoDb/attibuteManagement';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export const unwrappedHandler = async (
  event: EventBridgeEvent<string, StreamRecord>,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_BRAZE) !== 'true') {
    logger.info({ message: 'Braze events disabled, skipping...' });
    return;
  }

  const dynamoStream: StreamRecord = event.detail;
  switch (event['detail-type']) {
    case MemberEvent.BRAZE_PROFILE_CREATED: {
      const { newImage: newProfile } = unmarshallStreamImages<ProfileModel>(dynamoStream);
      await sendBrazeProfileCreated(newProfile);
      break;
    }
    case MemberEvent.BRAZE_PROFILE_UPDATED:
      await isSendBrazeProfileUpdated(dynamoStream);
      break;
    case MemberEvent.BRAZE_APPLICATION_CREATED: {
      const { newImage: newApplication } = unmarshallStreamImages<ApplicationModel>(dynamoStream);
      await sendBrazeApplicationCreated(newApplication);
      break;
    }
    case MemberEvent.BRAZE_APPLICATION_UPDATED:
      await isSendBrazeApplicationUpdated(dynamoStream);
      break;
    case MemberEvent.BRAZE_APPLICATION_DELETED:
      await isSendBrazeApplicationDeleted(dynamoStream);
      break;
    case MemberEvent.BRAZE_CARD_CREATED: {
      const { newImage: newCard } = unmarshallStreamImages<CardModel>(dynamoStream);
      await sendBrazeCardCreated(newCard);
      break;
    }
    case MemberEvent.BRAZE_CARD_UPDATED:
      await isSendBrazeCardUpdated(dynamoStream);
      break;
    case MemberEvent.BRAZE_USER_ANON:
    case MemberEvent.BRAZE_USER_GDPR:
      // TODO GDPR and ANON actions
      break;
  }
};

async function sendBrazeProfileCreated(profile: ProfileModel | undefined): Promise<void> {
  const payload = {
    external_id: profile?.memberId,
    first_name: profile?.firstName,
    last_name: profile?.lastName,
    dob: profile?.dateOfBirth,
    gender: profile?.gender,
    phone: profile?.phoneNumber,
    email: profile?.email,
    county: profile?.county,
    service: profile?.organisationId,
    trust: profile?.employerId,
    sign_up_date: profile?.signupDate,
  };

  await sendBrazeSQSMessage('userprofile.created', payload);
}

async function sendBrazeApplicationCreated(
  application: ApplicationModel | undefined,
): Promise<void> {
  const payload = {
    external_id: application?.memberId,
    card_requested: application?.startDate,
    card_status: application?.eligibilityStatus,
    card_holder: false,
  };

  await sendBrazeSQSMessage('privcard.create', payload);
}

async function sendBrazeCardCreated(card: CardModel | undefined): Promise<void> {
  const payload = {
    external_id: card?.memberId,
    card_requested: card?.createdDate,
    card_authorised: card?.purchaseDate,
    card_expiry_date: card?.expiryDate,
    card_status: card?.cardStatus,
    card_holder: true,
  };

  await sendBrazeSQSMessage('privcard.update', payload);
}

async function isSendBrazeProfileUpdated(dynamoStream: StreamRecord | undefined): Promise<void> {
  const { newImage: newProfile } = unmarshallStreamImages<ProfileModel>(dynamoStream);

  const payload: Record<string, unknown> = {};
  payload.external_id = newProfile?.memberId;

  if (hasAttributeChanged('firstName', dynamoStream)) {
    payload.first_name = newProfile?.firstName;
  }

  if (hasAttributeChanged('lastName', dynamoStream)) {
    payload.last_name = newProfile?.lastName;
  }

  if (hasAttributeChanged('email', dynamoStream)) {
    payload.email = newProfile?.email;
  }

  if (hasAttributeChanged('dateOfBirth', dynamoStream)) {
    payload.dob = newProfile?.dateOfBirth;
  }

  if (hasAttributeChanged('gender', dynamoStream)) {
    payload.gender = newProfile?.gender;
  }

  if (hasAttributeChanged('phoneNumber', dynamoStream)) {
    payload.phone = newProfile?.phoneNumber;
  }

  if (hasAttributeChanged('county', dynamoStream)) {
    payload.county = newProfile?.county;
  }

  if (hasAttributeChanged('organisationId', dynamoStream)) {
    payload.service = newProfile?.organisationId;
  }

  if (hasAttributeChanged('employerId', dynamoStream)) {
    payload.trust = newProfile?.employerId;
  }

  await sendBrazeSQSMessage('userprofile.update', payload);
}

async function isSendBrazeApplicationUpdated(
  dynamoStream: StreamRecord | undefined,
): Promise<void> {
  const { oldImage: oldApplication, newImage: newApplication } =
    unmarshallStreamImages<ApplicationModel>(dynamoStream);

  const payload: Record<string, unknown> = {};
  payload.external_id = newApplication?.memberId;

  if (
    hasAttributeChanged('eligibilityStatus', dynamoStream) &&
    newApplication?.eligibilityStatus === EligibilityStatus.ELIGIBLE
  ) {
    payload.card_status = newApplication?.eligibilityStatus;
    payload.card_authorised = newApplication?.startDate;
    payload.time_uploaded = newApplication?.startDate;
    payload.card_holder = !!(
      newApplication?.paymentStatus?.startsWith('PAID') ||
      oldApplication?.paymentStatus?.startsWith('PAID')
    );
  }

  if (
    hasAttributeChanged('paymentStatus', dynamoStream) &&
    newApplication?.paymentStatus?.startsWith('PAID')
  ) {
    payload.card_status = newApplication?.paymentStatus;
    payload.card_purchased = newApplication?.purchaseDate;
    payload.card_holder = !!(
      newApplication?.eligibilityStatus || oldApplication?.eligibilityStatus
    );
  }

  await sendBrazeSQSMessage('privcard.update', payload);
}

async function isSendBrazeApplicationDeleted(
  // TODO: When implemlented remove this eslint disable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dynamoStream: StreamRecord | undefined,
): Promise<void> {
  // TODO: send something to braze when application deleted?
}

async function isSendBrazeCardUpdated(dynamoStream: StreamRecord | undefined): Promise<void> {
  const { newImage: newCard } = unmarshallStreamImages<CardModel>(dynamoStream);

  const payload: Record<string, unknown> = {};
  payload.external_id = newCard?.memberId;

  if (hasAttributeChanged('cardStatus', dynamoStream)) {
    payload.card_status = newCard?.cardStatus;
    payload.card_holder = !(
      newCard?.cardStatus === CardStatus.CARD_LOST ||
      newCard?.cardStatus === CardStatus.DISABLED ||
      newCard?.cardStatus === CardStatus.CARD_EXPIRED
    );
  }

  if (hasAttributeChanged('paymentStatus', dynamoStream)) {
    payload.card_holder = !(
      newCard?.paymentStatus === PaymentStatus.AWAITING_PAYMENT ||
      newCard?.paymentStatus === PaymentStatus.PENDING_REFUND ||
      newCard?.paymentStatus === PaymentStatus.REFUNDED
    );
  }

  if (hasAttributeChanged('expiryDate', dynamoStream)) {
    payload.card_expiry_date = newCard?.expiryDate;
  }

  if (hasAttributeChanged('postedDate', dynamoStream)) {
    payload.card_posted = newCard?.postedDate;
  }

  await sendBrazeSQSMessage('privcard.update', payload);
}

async function sendBrazeSQSMessage(
  eventType: string,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    const command = new SendMessageCommand({
      QueueUrl: getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_BRAZE_SQS_QUEUE),
      DelaySeconds: 10,
      MessageAttributes: {
        Type: {
          DataType: 'String',
          StringValue: eventType,
        },
      },
      MessageBody: JSON.stringify(payload),
    });

    const client = new SQSClient({ region: getEnv(MemberStackEnvironmentKeys.REGION) });
    await client.send(command);
  } catch (error) {
    logger.error({ message: 'Failed to send SQS message', error });
  }
}

export const handler = eventBusMiddleware(unwrappedHandler);
