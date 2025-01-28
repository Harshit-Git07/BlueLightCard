import { EventBridgeEvent, StreamRecord } from 'aws-lambda';
import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import { eventBusMiddleware, logger } from '../../middleware';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { hasAttributeChanged } from '@blc-mono/members/application/utils/dynamoDb/attibuteManagement';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';

export const unwrappedHandler = async (
  event: EventBridgeEvent<string, StreamRecord>,
): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_DWH) !== 'true') {
    logger.info({ message: 'DWH events disabled, skipping...' });
    return;
  }

  const dynamoStream: StreamRecord = event.detail;
  switch (event['detail-type']) {
    case MemberEvent.DWH_PROFILE_CREATED: {
      const { newImage: newProfile } = unmarshallStreamImages<ProfileModel>(dynamoStream);
      const lastUpdated = getLastUpdated(dynamoStream);
      if (!lastUpdated) return;

      await sendDwhUserUuid(newProfile, lastUpdated);
      await sendDwhUsersNew(newProfile, lastUpdated);
      await sendDwhUsersConfirmed(newProfile, lastUpdated);
      await sendDwhUsesValidated(newProfile, lastUpdated);
      await sendDwhUsersTrustMember(newProfile, lastUpdated);
      await sendDwhUsersServiceMember(newProfile, lastUpdated);
      await sendDwhUsersCounty(newProfile, lastUpdated);
      await sendDwhUsersEmail(newProfile, lastUpdated);
      await sendDwhUserProfiles(newProfile, lastUpdated);
      await sendDwhUserChanges(newProfile);
      break;
    }
    case MemberEvent.DWH_PROFILE_UPDATED:
      await sendProfileUpdateToDwh(dynamoStream);
      break;
    case MemberEvent.DWH_APPLICATION_CREATED: {
      const { newImage: newApplication } = unmarshallStreamImages<ApplicationModel>(dynamoStream);
      await sendDwhPrivCardsActionsApplication(newApplication);
      break;
    }
    case MemberEvent.DWH_APPLICATION_UPDATED:
      await sendApplicationUpdateToDwh(dynamoStream);
      break;
    case MemberEvent.DWH_CARD_CREATED: {
      const { newImage: newCard } = unmarshallStreamImages<CardModel>(dynamoStream);
      await sendDwhPrivCardsActionsCard(newCard);
      break;
    }
    case MemberEvent.DWH_CARD_UPDATED:
      await sendCardUpdateToDwh(dynamoStream);
      break;
    case MemberEvent.DWH_USER_ANON:
    case MemberEvent.DWH_USER_GDPR:
      // TODO GDPR and ANON actions
      break;
  }
};

async function sendProfileUpdateToDwh(dynamoStream: StreamRecord | undefined): Promise<void> {
  const { newImage: newProfile } = unmarshallStreamImages<ProfileModel>(dynamoStream);
  const lastUpdated = getLastUpdated(dynamoStream);
  if (!lastUpdated) return;

  if (hasAttributeChanged('status', dynamoStream)) {
    await sendDwhUsersConfirmed(newProfile, lastUpdated);
  }

  if (hasAttributeChanged('emailValidated', dynamoStream)) {
    await sendDwhUsesValidated(newProfile, lastUpdated);
  }

  if (hasAttributeChanged('employerId', dynamoStream)) {
    await sendDwhUsersTrustMember(newProfile, lastUpdated);
  }

  if (hasAttributeChanged('organisationId', dynamoStream)) {
    await sendDwhUsersServiceMember(newProfile, lastUpdated);
  }

  if (hasAttributeChanged('email', dynamoStream)) {
    await sendDwhUsersCounty(newProfile, lastUpdated);
  }

  if (hasAttributeChanged('county', dynamoStream)) {
    await sendDwhUsersEmail(newProfile, lastUpdated);
  }

  if (
    hasAttributeChanged('dateOfBirth', dynamoStream) ||
    hasAttributeChanged('gender', dynamoStream) ||
    hasAttributeChanged('phoneNumber', dynamoStream)
  ) {
    await sendDwhUserProfiles(newProfile, lastUpdated);
  }

  if (
    hasAttributeChanged('lastIpAddress', dynamoStream) ||
    hasAttributeChanged('lastLogin', dynamoStream)
  ) {
    await sendDwhUserChanges(newProfile);
  }
}

// TODO: When implemlented remove this eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendApplicationUpdateToDwh(dynamoStream: StreamRecord | undefined): Promise<void> {
  // TODO: Pending conversation with DWH about revised app payload with no card #
}

// TODO: When implemlented remove this eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendCardUpdateToDwh(dynamoStream: StreamRecord | undefined): Promise<void> {
  // TODO: Pending conversation with DWH about revised card payload with new format
}

async function sendDwhUserUuid(
  profile: ProfileModel | undefined,
  lastUpdated: string,
): Promise<void> {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERUUID,
  );

  const payload = {
    id: profile?.memberId,
    uuid: profile?.memberId,
    last_updated: lastUpdated,
  };

  await sendDwhFirehoseStream(firehoseStream, payload);
}

async function sendDwhUsersNew(
  profile: ProfileModel | undefined,
  lastUpdated: string,
): Promise<void> {
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

  await sendDwhFirehoseStream(firehoseStream, payload);
}

async function sendDwhUsersConfirmed(
  profile: ProfileModel | undefined,
  lastUpdated: string,
): Promise<void> {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSCONFIRMED,
  );

  const payload = {
    id: profile?.memberId,
    confirmed: profile?.status,
    last_updated: lastUpdated,
  };

  await sendDwhFirehoseStream(firehoseStream, payload);
}

async function sendDwhUsesValidated(
  profile: ProfileModel | undefined,
  lastUpdated: string,
): Promise<void> {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSVALIDATED,
  );

  const payload = {
    id: profile?.memberId,
    validated: profile?.emailValidated,
    last_updated: lastUpdated,
  };

  await sendDwhFirehoseStream(firehoseStream, payload);
}

async function sendDwhUsersServiceMember(
  profile: ProfileModel | undefined,
  lastUpdated: string,
): Promise<void> {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSSERVICEMEMBER,
  );

  const payload = {
    id: profile?.memberId,
    servicemember: profile?.organisationId,
    last_updated: lastUpdated,
  };

  await sendDwhFirehoseStream(firehoseStream, payload);
}

async function sendDwhUsersTrustMember(
  profile: ProfileModel | undefined,
  lastUpdated: string,
): Promise<void> {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSTRUSTMEMBER,
  );

  await sendDwhFirehoseStream(firehoseStream, {
    id: profile?.memberId,
    trustmember: profile?.employerId,
    last_updated: lastUpdated,
  });
}

async function sendDwhUsersCounty(
  profile: ProfileModel | undefined,
  lastUpdated: string,
): Promise<void> {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSCOUNTY,
  );

  await sendDwhFirehoseStream(firehoseStream, {
    id: profile?.memberId,
    county: profile?.county,
    last_updated: lastUpdated,
  });
}

async function sendDwhUsersEmail(
  profile: ProfileModel | undefined,
  lastUpdated: string,
): Promise<void> {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERSEMAIL,
  );

  await sendDwhFirehoseStream(firehoseStream, {
    id: profile?.memberId,
    email: profile?.email,
    last_updated: lastUpdated,
  });
}

async function sendDwhUserProfiles(
  profile: ProfileModel | undefined,
  lastUpdated: string,
): Promise<void> {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_USERPROFILES,
  );

  await sendDwhFirehoseStream(firehoseStream, {
    id: profile?.memberId,
    dob: profile?.dateOfBirth,
    gender: profile?.gender,
    mobile: profile?.phoneNumber,
    last_updated: lastUpdated,
  });
}

// TODO: Verify what this is supposed to do, at the time of adding this eslint disable it didn't do very much...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendDwhUserChanges(profile: ProfileModel | undefined): Promise<void> {
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

  await sendDwhFirehoseStream(firehoseStream, {});
}

async function sendDwhPrivCardsActionsApplication(
  // TODO: Verify what this is supposed to do, at the time of adding this eslint disable it didn't do very much...
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  application: ApplicationModel | undefined,
): Promise<void> {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS,
  );

  //TODO - update priv card actions for promo and id upload etc

  await sendDwhFirehoseStream(firehoseStream, {});
}

// TODO: Verify what this is supposed to do, at the time of adding this eslint disable it didn't do very much...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendDwhPrivCardsActionsCard(card: CardModel | undefined): Promise<void> {
  const firehoseStream: string = getEnv(
    MemberStackEnvironmentKeys.SERVICE_LAYER_DWH_STREAM_PRIVCARDSACTIONS,
  );

  //TODO - update priv card actions for status change for batch, print, post etc

  await sendDwhFirehoseStream(firehoseStream, {});
}

async function sendDwhFirehoseStream(streamName: string, payload: object): Promise<void> {
  try {
    const command = new PutRecordCommand({
      DeliveryStreamName: streamName,
      Record: {
        Data: new TextEncoder().encode(JSON.stringify(payload)),
      },
    });

    const client = new FirehoseClient();
    await client.send(command);
  } catch (error) {
    logger.error({ message: 'Failed to send firehose stream', error });
  }
}

function getLastUpdated(dynamoStream: StreamRecord | undefined): string | undefined {
  const { newImage: newImage } = unmarshallStreamImages<Record<string, string>>(dynamoStream);
  return newImage?.['lastUpdated'];
}

export const handler = eventBusMiddleware(unwrappedHandler);
