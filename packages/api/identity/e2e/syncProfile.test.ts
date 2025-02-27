import { PutEventsRequest } from '@aws-sdk/client-eventbridge';
import { putEvent } from './helpers/eventbridge';
import { v4 as UUID } from 'uuid';
import {
  createProfileItemInIdentityTableFor,
  deleteProfileItemFromIdentityTableFor,
  getItemFromIdentityTable,
} from './helpers/dynamo';
import { waitOn } from '../../core/src/utils/waitOn';
import { afterEach, describe, expect, it } from 'vitest';
import { REGIONS } from '../../core/src/types/regions.enum';
import { getBrandFromEnv } from '../../core/src/utils/checkBrand';
import { isLocal } from '../../core/src/utils/checkEnvironment';
import { Config } from 'sst/node/config';
import { E2E_TEST_TIMEOUT } from './helpers/constants';

describe('Identity: User Profile Sync', () => {
  const brands = isLocal(Config.STAGE) ? ['BLC_UK', 'DDS_UK', 'BLC_AU'] : [getBrandFromEnv()];
  const eventBusName = Config.SHARED_EVENT_BUS_NAME;
  const identityTableName = Config.IDENTITY_TABLE_NAME;

  brands.forEach((brand) => {
    const surname = `E2E-${brand}-profile-sync`;
    const firstName = `E2E-${brand}-profile-sync-first-name`;
    const email = `${firstName}@blc.co.uk`;
    const memberUuid = UUID();
    const userSyncProfileDetails = {
      gender: 'F',
      uuid: memberUuid,
      email,
      brand,
      employer: 'trustName',
      employer_id: 'trustId',
      organisation: 'NHS',
      firstname: firstName,
      email_validated: 0,
      spare_email: '',
      spare_email_validated: 0,
      surname: surname,
      dob: new Date('1990-12-23').toISOString(),
      mobile: '07700000000',
    };

    const region = brand === 'BLC_AU' ? REGIONS.AP_SOUTHEAST_2 : REGIONS.EU_WEST_2;

    describe(`for brand ${brand}`, () => {
      let profileSortKey: string;

      afterEach(async () => {
        if (profileSortKey) {
          await deleteProfileItemFromIdentityTableFor(
            memberUuid,
            profileSortKey,
            region,
            identityTableName,
          );
        }
      });

      it(
        'should create user when "user.profile.updated" is sent and user does not yet exist',
        async () => {
          const userProfileUpdateEntry = {
            Entries: [
              {
                EventBusName: eventBusName,
                Source: 'user.profile.updated',
                DetailType: `${brand} User Profile Updated`,
                Detail: JSON.stringify(userSyncProfileDetails),
                Time: new Date(),
              },
            ],
          } as PutEventsRequest;

          const result = await putEvent(userProfileUpdateEntry, region);

          expect(result.$metadata.httpStatusCode).toEqual(200);
          await thenProfileDetailsWereCreatedSuccessfully();
        },
        E2E_TEST_TIMEOUT,
      );

      it(
        'should update user when "user.profile.updated" is sent and user already exists',
        async () => {
          const profileUuid = UUID();
          profileSortKey = `PROFILE#${profileUuid}`;
          await createProfileItemInIdentityTableFor(
            memberUuid,
            profileUuid,
            region,
            identityTableName,
          );
          const userProfileUpdateEntry = {
            Entries: [
              {
                EventBusName: eventBusName,
                Source: 'user.profile.updated',
                DetailType: `${brand} User Profile Updated`,
                Detail: JSON.stringify(userSyncProfileDetails),
                Time: new Date(),
              },
            ],
          } as PutEventsRequest;

          const result = await putEvent(userProfileUpdateEntry, region);

          expect(result.$metadata.httpStatusCode).toEqual(200);
          await thenProfileDetailsWereUpdatedSuccessfully(profileUuid);
        },
        E2E_TEST_TIMEOUT,
      );

      async function thenProfileDetailsWereUpdatedSuccessfully(profileUuid: string): Promise<void> {
        await waitOn(async () => {
          const profileDetails = await getItemFromIdentityTable(
            memberUuid,
            'PROFILE#',
            region,
            identityTableName,
          );

          expect(profileDetails).toBeDefined();
          expect(profileDetails?.pk).toBe(`MEMBER#${memberUuid}`);
          expect(profileDetails?.sk).toBe(`PROFILE#${profileUuid}`);
          expect(profileDetails?.gender).toBe('F');
          expect(profileDetails?.firstname).toBe(firstName);
          expect(profileDetails?.surname).toBe(surname);
          expect(profileDetails?.email).toBe(email);
          expect(profileDetails?.organisation).toBe('NHS');
          expect(profileDetails?.dob).toBe('1990-12-23');
          expect(profileDetails?.mobile).toBe('07700000000');
          expect(profileDetails?.email_validated).toBe(0);
          expect(profileDetails?.employer).toBe('trustName');
          expect(profileDetails?.employer_id).toBe('trustId');
          expect(profileDetails?.spare_email_validated).toBe(0);
          expect(profileDetails?.spare_email).toBe('NA');
          expect(profileDetails?.merged_uid).not.toBeDefined();
          expect(profileDetails?.merged_time).not.toBeDefined();
        });
      }

      async function thenProfileDetailsWereCreatedSuccessfully(): Promise<void> {
        await waitOn(async () => {
          const profileDetails = await getItemFromIdentityTable(
            memberUuid,
            'PROFILE#',
            region,
            identityTableName,
          );

          expect(profileDetails).toBeDefined();
          expect(profileDetails?.pk).toBe(`MEMBER#${memberUuid}`);
          expect(profileDetails?.sk).toContain(`PROFILE#`);
          profileSortKey = profileDetails?.sk;
          expect(profileDetails?.email).toBe(email);
          expect(profileDetails?.firstname).toBe(firstName);
          expect(profileDetails?.surname).toBe(surname);
          expect(profileDetails?.gender).toBe('F');
          expect(profileDetails?.dob).toBe('1990-12-23');
          expect(profileDetails?.mobile).toBe('07700000000');
          expect(profileDetails?.employer).toBe('trustName');
          expect(profileDetails?.employer_id).toBe('trustId');
          expect(profileDetails?.organisation).toBe('NHS');
          expect(profileDetails?.email_validated).toBe(0);
          expect(profileDetails?.spare_email_validated).toBe(0);
          expect(profileDetails?.spare_email).toBe('NA');
          expect(profileDetails?.merged_uid).not.toBeDefined();
          expect(profileDetails?.merged_time).not.toBeDefined();
        });
      }
    });
  });
});
