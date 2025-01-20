import { EventBridgeEvent, StreamRecord } from 'aws-lambda';
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
  event: EventBridgeEvent<string, StreamRecord>,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_DWH) !== 'true') {
    return;
  }

  const dynamoStream: StreamRecord = event.detail;
  switch (event['detail-type']) {
    case MemberEvent.DWH_PROFILE_CREATED: {
      const { newImage: newProfile } = unmarshallStreamImages<ProfileModel>(dynamoStream);
      const lastUpdated = getLastUpdated(dynamoStream);
      if (!lastUpdated) return;

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
    }
    case MemberEvent.DWH_PROFILE_UPDATED:
      isSendProfileUpdateToDwh(dynamoStream);
      break;
    case MemberEvent.DWH_APPLICATION_CREATED: {
      const { newImage: newApplication } = unmarshallStreamImages<ApplicationModel>(dynamoStream);
      sendDwhPrivCardsActionsApplication(newApplication);
      break;
    }
    case MemberEvent.DWH_APPLICATION_UPDATED:
      isSendApplicationUpdateToDwh(dynamoStream);
      break;
    case MemberEvent.DWH_CARD_CREATED: {
      const { newImage: newCard } = unmarshallStreamImages<CardModel>(dynamoStream);
      sendDwhPrivCardsActionsCard(newCard);
      break;
    }
    case MemberEvent.DWH_CARD_UPDATED:
      isSendCardUpdateToDwh(dynamoStream);
      break;
    case MemberEvent.DWH_USER_ANON:
    case MemberEvent.DWH_USER_GDPR:
      // TODO GDPR and ANON actions
      break;
  }
};

function isSendProfileUpdateToDwh(dynamoStream: StreamRecord | undefined): void {
  const { newImage: newProfile } = unmarshallStreamImages<ProfileModel>(dynamoStream);
  const lastUpdated = getLastUpdated(dynamoStream);
  if (!lastUpdated) return;

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
}

// TODO: When implemlented remove this eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isSendApplicationUpdateToDwh = (dynamoStream: StreamRecord | undefined) => {
  // TODO: Pending conversation with DWH about revised app payload with no card #
};

// TODO: When implemlented remove this eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isSendCardUpdateToDwh = (dynamoStream: StreamRecord | undefined) => {
  // TODO: Pending conversation with DWH about revised card payload with new format
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

function sendDwhUsersTrustMember(profile: ProfileModel | undefined, lastUpdated: string): void {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSTRUSTMEMBER,
  );

  sendDwhFirehoseStream(firehoseStream, {
    id: profile?.memberId,
    trustmember: profile?.employerId,
    last_updated: lastUpdated,
  });
}

function sendDwhUsersCounty(profile: ProfileModel | undefined, lastUpdated: string): void {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSCOUNTY,
  );

  sendDwhFirehoseStream(firehoseStream, {
    id: profile?.memberId,
    county: profile?.county,
    last_updated: lastUpdated,
  });
}

function sendDwhUsersEmail(profile: ProfileModel | undefined, lastUpdated: string): void {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSEMAIL,
  );

  sendDwhFirehoseStream(firehoseStream, {
    id: profile?.memberId,
    email: profile?.email,
    last_updated: lastUpdated,
  });
}

function sendDwhUserProfiles(profile: ProfileModel | undefined, lastUpdated: string): void {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERPROFILES,
  );

  sendDwhFirehoseStream(firehoseStream, {
    id: profile?.memberId,
    dob: profile?.dateOfBirth,
    gender: profile?.gender,
    mobile: profile?.phoneNumber,
    last_updated: lastUpdated,
  });
}

// TODO: Verify what this is supposed to do, at the time of adding this eslint disable it didn't do very much...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sendDwhUserChanges(profile: ProfileModel | undefined): void {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERCHANGES,
  );

  // TODO: Can this be removed? It is unused...
  // const payload = {
  //   id: profile?.memberId,
  //   ip: profile?.lastIpAddress,
  //   browser: 'TBC',
  //   changetype: 'TBC',
  //   details: 'TBC',
  //   time: profile?.lastLogin,
  // };

  sendDwhFirehoseStream(firehoseStream, {});
}

// TODO: Verify what this is supposed to do, at the time of adding this eslint disable it didn't do very much...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sendDwhPrivCardsActionsApplication(application: ApplicationModel | undefined): void {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS,
  );

  //TODO - update priv card actions for promo and id upload etc

  sendDwhFirehoseStream(firehoseStream, {});
}

// TODO: Verify what this is supposed to do, at the time of adding this eslint disable it didn't do very much...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sendDwhPrivCardsActionsCard(card: CardModel | undefined): void {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS,
  );

  //TODO - update priv card actions for status change for batch, print, post etc

  sendDwhFirehoseStream(firehoseStream, {});
}

function sendDwhFirehoseStream(streamName: string, payload: object): void {
  const client = new FirehoseClient();
  const input = {
    DeliveryStreamName: streamName,
    Record: {
      Data: new TextEncoder().encode(JSON.stringify(payload)),
    },
  };

  const command = new PutRecordCommand(input);
  client.send(command).catch((err) => {
    logger.error(err);
  });
}

function getLastUpdated(dynamoStream: StreamRecord | undefined): string | undefined {
  const { newImage: newImage } = unmarshallStreamImages<Record<string, string>>(dynamoStream);
  return newImage?.['lastUpdated'];
}

export const handler = eventBusMiddleware(unwrappedHandler);
