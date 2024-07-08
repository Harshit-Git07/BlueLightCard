import { PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { v5 } from 'uuid';
import { eventBridgeClient, logger } from '../instances';
import { EVENT_SOURCE_BANNERS_CREATE, EVENT_SOURCE_USER_MIGRATED } from '../constants';
import bannersJSON from '../../../data/banners.json';

type UserData = {
  uuid: string;
  legacyUserId: number;
  brand: string;
  name: string;
};

function createUserData({ uuid, brand, name, legacyUserId }: UserData) {
  const profileUuid = v5(name, v5.URL);
  return {
    uuid,
    brand,
    profileUuid: profileUuid,
    legacyUserId: legacyUserId,
    name: name,
    surname: '',
    dob: '2002-04-10',
    gender: '',
    mobile: '',
    email: '',
    emailValidated: 1,
    spareemail: '',
    spareemailvalidated: 1,
    service: 'nhs',
    county: '',
    trustId: '0',
    trustName: '',
    merged_uid: '0',
    merged_time: '',
    ga_key: '',
    cardId: '',
    cardExpires: '',
    cardStatus: 1,
    cardPosted: '',
  } satisfies Record<string, unknown>;
}

/**
 * This triggers the sign in migration lambda which inserts the needed rows in dynamodb for this user i.e developer name.
 * This is required for the /user endpoint to work.
 */
export async function triggerCognitoMigration(
  eventBusName: string,
  { uuid, brand, name, legacyUserId }: UserData,
) {
  const command = new PutEventsCommand({
    Entries: [
      {
        Time: new Date(),
        EventBusName: eventBusName,
        Source: EVENT_SOURCE_USER_MIGRATED,
        DetailType: `${brand} User Sign In Migrated`,
        Detail: JSON.stringify(
          createUserData({
            uuid,
            brand,
            name,
            legacyUserId,
          }),
        ),
      },
    ],
  });
  logger.info({ message: `Triggering cognito migration via event bus '${eventBusName}'` });
  await eventBridgeClient.send(command);
}

export async function triggerBannersEvent(eventBusName: string, brand: string) {
  const banners = bannersJSON.slice(0, 10).map((banner) => {
    // add 1 day to the current date, to make sure the banners are always in date
    banner.end = new Date(Date.now() + 3600 * 1000 * 24).getTime();
    return banner;
  });
  const command = new PutEventsCommand({
    // max entry size allowed is <= 10
    Entries: banners.map((banner) => ({
      Time: new Date(),
      EventBusName: eventBusName,
      Source: EVENT_SOURCE_BANNERS_CREATE,
      DetailType: `${brand} Banner '${banner.name}' created`,
      Detail: JSON.stringify(banner),
    })),
  });
  logger.info({ message: `Triggering banner creation via event bus '${eventBusName}'` });
  await eventBridgeClient.send(command);
}
