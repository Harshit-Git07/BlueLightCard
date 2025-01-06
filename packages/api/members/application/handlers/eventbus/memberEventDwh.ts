import { Context, EventBridgeEvent, StreamRecord } from 'aws-lambda';
import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import { eventBusMiddleware, logger } from '../../middleware';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ApplicationModel } from '@blc-mono/members/application/models/applicationModel';
import { CardModel } from '@blc-mono/members/application/models/cardModel';
import { ProfileModel } from '@blc-mono/members/application/models/profileModel';
import { MemberEvent } from '@blc-mono/members/application/models/enums/MemberEvent';
import { hasAttributeChanged } from '@blc-mono/members/application/utils/dynamoDb/attibuteManagement';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export const unwrappedHandler = async (
  event: EventBridgeEvent<any, any>,
  context: Context,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_DWH) !== 'true') {
    return;
  }

  const dynamoStream: StreamRecord = event.detail;
  switch (event['detail-type']) {
    case MemberEvent.DWH_PROFILE_CREATED:
      const { oldImage: oldProfile, newImage: newProfile } =
        unmarshallStreamImages<ProfileModel>(dynamoStream);
      const lastUpdated = getLastUpdated(dynamoStream);
      sendDwhUserUuid(newProfile, lastUpdated);
      sendDwhUsersNew(newProfile, lastUpdated);
      sendDwhUsersConfirmed(newProfile, lastUpdated);
      sendDwhUsesValidated(newProfile, lastUpdated);
      sendDwhUsersTrustMember(newProfile, lastUpdated);
      sendDwhUsersServiceMember(newProfile, lastUpdated);
      sendDwhUsersCounty(newProfile, lastUpdated);
      sendDwhUsersEmail(newProfile, lastUpdated);
      sendDwhUserProfiles(newProfile, lastUpdated);
      sendDwhUserChanges(newProfile);
      break;
    case MemberEvent.DWH_PROFILE_UPDATED:
      isSendProfileUpdateToDwh(dynamoStream);
      break;
    case MemberEvent.DWH_APPLICATION_CREATED:
      const { oldImage: oldApplication, newImage: newApplication } =
        unmarshallStreamImages<ApplicationModel>(dynamoStream);
      sendDwhPrivCardsActionsApplication(newApplication);
      break;
    case MemberEvent.DWH_APPLICATION_UPDATED:
      isSendApplicationUpdateToDwh(dynamoStream);
      break;
    case MemberEvent.DWH_CARD_CREATED:
      const { oldImage: oldCard, newImage: newCard } =
        unmarshallStreamImages<CardModel>(dynamoStream);
      sendDwhPrivCardsActionsCard(newCard);
      break;
    case MemberEvent.DWH_CARD_UPDATED:
      isSendCardUpdateToDwh(dynamoStream);
      break;
    case MemberEvent.DWH_USER_ANON:
    case MemberEvent.DWH_USER_GDPR:
      // TODO GDPR and ANON actions
      break;
  }
};

const isSendProfileUpdateToDwh = (dynamoStream: StreamRecord | undefined) => {
  const { oldImage: oldProfile, newImage: newProfile } =
    unmarshallStreamImages<ProfileModel>(dynamoStream);
  const lastUpdated = getLastUpdated(dynamoStream);

  if (hasAttributeChanged('status', dynamoStream)) {
    sendDwhUsersConfirmed(newProfile, lastUpdated);
  }

  if (hasAttributeChanged('emailValidated', dynamoStream)) {
    sendDwhUsesValidated(newProfile, lastUpdated);
  }

  if (hasAttributeChanged('employerId', dynamoStream)) {
    sendDwhUsersTrustMember(newProfile, lastUpdated);
  }

  if (hasAttributeChanged('organisationId', dynamoStream)) {
    sendDwhUsersServiceMember(newProfile, lastUpdated);
  }

  if (hasAttributeChanged('email', dynamoStream)) {
    sendDwhUsersCounty(newProfile, lastUpdated);
  }

  if (hasAttributeChanged('county', dynamoStream)) {
    sendDwhUsersEmail(newProfile, lastUpdated);
  }

  if (
    hasAttributeChanged('dateOfBirth', dynamoStream) ||
    hasAttributeChanged('gender', dynamoStream) ||
    hasAttributeChanged('phoneNumber', dynamoStream)
  ) {
    sendDwhUserProfiles(newProfile, lastUpdated);
  }

  if (
    hasAttributeChanged('lastIpAddress', dynamoStream) ||
    hasAttributeChanged('lastLogin', dynamoStream)
  ) {
    sendDwhUserChanges(newProfile);
  }
};

const isSendApplicationUpdateToDwh = (dynamoStream: StreamRecord | undefined) => {
  // TODO - Pending conversation with DWH about revised app payload with no card #
};

const isSendCardUpdateToDwh = (dynamoStream: StreamRecord | undefined) => {
  // TODO - Pending conversation with DWH about revised card payload with new format
};

const sendDwhUserUuid = (profile: ProfileModel | undefined, lastUpdated: string) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERUUID,
  );

  const payload = {
    id: profile?.memberId,
    uuid: profile?.memberId,
    last_updated: lastUpdated,
  };

  sendDwhFirehoseStream(firehoseStream, payload);
};

const sendDwhUsersNew = (profile: ProfileModel | undefined, lastUpdated: string) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSNEW,
  );

  const payload = {
    id: profile?.memberId,
    position: '',
    signup_date: profile?.signupDate,
    referedby: '',
    service: profile?.organisationId,
    last_updated: lastUpdated,
  };

  sendDwhFirehoseStream(firehoseStream, payload);
};

const sendDwhUsersConfirmed = (profile: ProfileModel | undefined, lastUpdated: string) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSCONFIRMED,
  );

  const payload = {
    id: profile?.memberId,
    confirmed: profile?.status,
    last_updated: lastUpdated,
  };

  sendDwhFirehoseStream(firehoseStream, payload);
};

const sendDwhUsesValidated = (profile: ProfileModel | undefined, lastUpdated: string) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSVALIDATED,
  );

  const payload = {
    id: profile?.memberId,
    validated: profile?.emailValidated,
    last_updated: lastUpdated,
  };

  sendDwhFirehoseStream(firehoseStream, payload);
};

const sendDwhUsersServiceMember = (profile: ProfileModel | undefined, lastUpdated: string) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSSERVICEMEMBER,
  );

  const payload = {
    id: profile?.memberId,
    servicemember: profile?.organisationId,
    last_updated: lastUpdated,
  };

  sendDwhFirehoseStream(firehoseStream, payload);
};

const sendDwhUsersTrustMember = (profile: ProfileModel | undefined, lastUpdated: string) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSTRUSTMEMBER,
  );

  const payload = {
    id: profile?.memberId,
    trustmember: profile?.employerId,
    last_updated: lastUpdated,
  };

  sendDwhFirehoseStream(firehoseStream, payload);
};

const sendDwhUsersCounty = (profile: ProfileModel | undefined, lastUpdated: string) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSCOUNTY,
  );

  const payload = {
    id: profile?.memberId,
    county: profile?.county,
    last_updated: lastUpdated,
  };

  sendDwhFirehoseStream(firehoseStream, payload);
};

const sendDwhUsersEmail = (profile: ProfileModel | undefined, lastUpdated: string) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSEMAIL,
  );

  const payload = {
    id: profile?.memberId,
    email: profile?.email,
    last_updated: lastUpdated,
  };

  sendDwhFirehoseStream(firehoseStream, payload);
};

const sendDwhUserProfiles = (profile: ProfileModel | undefined, lastUpdated: string) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERPROFILES,
  );

  const payload = {
    id: profile?.memberId,
    dob: profile?.dateOfBirth,
    gender: profile?.gender,
    mobile: profile?.phoneNumber,
    last_updated: lastUpdated,
  };

  sendDwhFirehoseStream(firehoseStream, payload);
};

const sendDwhUserChanges = (profile: ProfileModel | undefined) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERCHANGES,
  );

  const payload = {
    id: profile?.memberId,
    ip: profile?.lastIpAddress,
    browser: 'TBC',
    changetype: 'TBC',
    details: 'TBC',
    time: profile?.lastLogin,
  };

  sendDwhFirehoseStream(firehoseStream, {});
};

const sendDwhPrivCardsActionsApplication = (application: ApplicationModel | undefined) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS,
  );

  //TODO - update priv card actions for promo and id upload etc

  sendDwhFirehoseStream(firehoseStream, {});
};

const sendDwhPrivCardsActionsCard = (card: CardModel | undefined) => {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS,
  );

  //TODO - update priv card actions for status change for batch, print, post etc

  sendDwhFirehoseStream(firehoseStream, {});
};

const sendDwhFirehoseStream = (streamName: string, payload: object) => {
  const client = new FirehoseClient();
  const input = {
    DeliveryStreamName: streamName,
    Record: {
      Data: new TextEncoder().encode(JSON.stringify(payload)),
    },
  };

  const command = new PutRecordCommand(input);
  const response = client.send(command).catch((err) => {
    logger.error(err);
  });
};

const getLastUpdated = (dynamoStream: StreamRecord | undefined) => {
  const { newImage: newImage } = <Record<string, any>>unmarshallStreamImages(dynamoStream);
  return newImage['lastUpdated'];
};

export const handler = eventBusMiddleware(unwrappedHandler);
