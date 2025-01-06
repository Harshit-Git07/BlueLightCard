import { Context, EventBridgeEvent, StreamRecord } from 'aws-lambda';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { eventBusMiddleware, logger } from '../../middleware';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ProfileModel } from '@blc-mono/members/application/models/profileModel';
import { ApplicationModel } from '@blc-mono/members/application/models/applicationModel';
import { CardModel } from '@blc-mono/members/application/models/cardModel';
import { EligibilityStatus } from '@blc-mono/members/application/models/enums/EligibilityStatus';
import { PaymentStatus } from '@blc-mono/members/application/models/enums/PaymentStatus';
import { CardStatus } from '@blc-mono/members/application/models/enums/CardStatus';
import { MemberEvent } from '@blc-mono/members/application/models/enums/MemberEvent';
import { hasAttributeChanged } from '@blc-mono/members/application/utils/dynamoDb/attibuteManagement';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export const unwrappedHandler = async (
  event: EventBridgeEvent<any, any>,
  context: Context,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_BRAZE) !== 'true') {
    return;
  }

  const dynamoStream: StreamRecord = event.detail;
  switch (event['detail-type']) {
    case MemberEvent.BRAZE_PROFILE_CREATED:
      const { newImage: newProfile } = unmarshallStreamImages<ProfileModel>(dynamoStream);
      sendBrazeProfileCreated(newProfile);
      break;
    case MemberEvent.BRAZE_PROFILE_UPDATED:
      isSendBrazeProfileUpdated(dynamoStream);
      break;
    case MemberEvent.BRAZE_APPLICATION_CREATED:
      const { newImage: newApplication } = unmarshallStreamImages<ApplicationModel>(dynamoStream);
      sendBrazeApplicationCreated(newApplication);
      break;
    case MemberEvent.BRAZE_APPLICATION_UPDATED:
      isSendBrazeApplicationUpdated(dynamoStream);
      break;
    case MemberEvent.BRAZE_APPLICATION_DELETED:
      isSendBrazeApplicationDeleted(dynamoStream);
      break;
    case MemberEvent.BRAZE_CARD_CREATED:
      const { newImage: newCard } = unmarshallStreamImages<CardModel>(dynamoStream);
      sendBrazeCardCreated(newCard);
      break;
    case MemberEvent.BRAZE_CARD_UPDATED:
      isSendBrazeCardUpdated(dynamoStream);
      break;
    case MemberEvent.BRAZE_USER_ANON:
    case MemberEvent.BRAZE_USER_GDPR:
      // TODO GDPR and ANON actions
      break;
  }
};

const sendBrazeProfileCreated = (profile: ProfileModel | undefined) => {
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

  sendBrazeSQSMessage('userprofile.created', payload);
};

const sendBrazeApplicationCreated = (application: ApplicationModel | undefined) => {
  const payload = {
    external_id: application?.memberId,
    card_requested: application?.startDate,
    card_status: application?.eligibilityStatus,
    card_holder: false,
  };

  sendBrazeSQSMessage('privcard.create', payload);
};

const sendBrazeCardCreated = (card: CardModel | undefined) => {
  const payload = {
    external_id: card?.memberId,
    card_requested: card?.createdDate,
    card_authorised: card?.purchaseDate,
    card_expiry_date: card?.expiryDate,
    card_status: card?.cardStatus,
    card_holder: true,
  };

  sendBrazeSQSMessage('privcard.update', payload);
};

const isSendBrazeProfileUpdated = (dynamoStream: StreamRecord | undefined) => {
  const { oldImage: oldProfile, newImage: newProfile } =
    unmarshallStreamImages<ProfileModel>(dynamoStream);

  const payload: { [k: string]: any } = {};
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

  sendBrazeSQSMessage('userprofile.update', payload);
};

const isSendBrazeApplicationUpdated = (dynamoStream: StreamRecord | undefined) => {
  const { oldImage: oldApplication, newImage: newApplication } =
    unmarshallStreamImages<ApplicationModel>(dynamoStream);

  const payload: { [k: string]: any } = {};
  payload.external_id = newApplication?.memberId;

  if (
    hasAttributeChanged('eligibilityStatus', dynamoStream) &&
    newApplication?.eligibilityStatus == EligibilityStatus.ELIGIBLE
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

  sendBrazeSQSMessage('privcard.update', payload);
};

const isSendBrazeApplicationDeleted = (dynamoStream: StreamRecord | undefined) => {
  const { oldImage: oldApplication, newImage: newApplication } =
    unmarshallStreamImages<ApplicationModel>(dynamoStream);

  // TODO - send something to braze when application deleted?
};

const isSendBrazeCardUpdated = (dynamoStream: StreamRecord | undefined) => {
  const { oldImage: oldCard, newImage: newCard } = unmarshallStreamImages<CardModel>(dynamoStream);

  const payload: { [k: string]: any } = {};
  payload.external_id = newCard?.memberId;

  if (hasAttributeChanged('cardStatus', dynamoStream)) {
    payload.card_status = newCard?.cardStatus;
    payload.card_holder = !(
      newCard?.cardStatus == CardStatus.CARD_LOST ||
      newCard?.cardStatus == CardStatus.DISABLED ||
      newCard?.cardStatus == CardStatus.CARD_EXPIRED
    );
  }

  if (hasAttributeChanged('paymentStatus', dynamoStream)) {
    payload.card_holder = !(
      newCard?.paymentStatus == PaymentStatus.AWAITING_PAYMENT ||
      newCard?.paymentStatus == PaymentStatus.PENDING_REFUND ||
      newCard?.paymentStatus == PaymentStatus.REFUNDED
    );
  }

  if (hasAttributeChanged('expiryDate', dynamoStream)) {
    payload.card_expiry_date = newCard?.expiryDate;
  }

  if (hasAttributeChanged('postedDate', dynamoStream)) {
    payload.card_posted = newCard?.postedDate;
  }

  sendBrazeSQSMessage('privcard.update', payload);
};

const sendBrazeSQSMessage = (eventType: string, payload: object) => {
  const client = new SQSClient({ region: getEnv(MemberStackEnvironmentKeys.REGION) });
  const command = new SendMessageCommand({
    QueueUrl: getBrazeSQSQueue(),
    DelaySeconds: 10,
    MessageAttributes: {
      Type: {
        DataType: 'String',
        StringValue: eventType,
      },
    },
    MessageBody: JSON.stringify(payload),
  });

  const response = client.send(command).catch((err) => {
    logger.error(err);
  });
};

const getBrazeSQSQueue = () => {
  return getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_BRAZE_SQS_QUEUE);
};

export const handler = eventBusMiddleware(unwrappedHandler);
