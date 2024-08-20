import { setupE2eEnvironmentVars } from "./helpers/config";
import { PutEventsRequest } from "@aws-sdk/client-eventbridge";
import { putEvent } from "./helpers/eventbridge";
import { v4 as UUID } from "uuid";
import {
  deleteProfileItemFromIdentityTableFor,
  getItemFromIdentityTable
} from "./helpers/dynamo";
import { waitOn } from "../../core/src/utils/waitOn";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { REGIONS } from "../../core/src/types/regions.enum";
import { getBrandFromEnv } from "../../core/src/utils/checkBrand";
import { isLocal } from "../../core/src/utils/checkEnvironment";
import { Config } from "sst/node/config";

const e2eTestTimeout = 20 * 1000;

describe('Identity: User Profile Sync', () => {
  beforeAll(async () => {
    await setupE2eEnvironmentVars();
  });

  const brands = isLocal(Config.STAGE) ? ['BLC_UK', 'DDS_UK', 'BLC_AU'] : [getBrandFromEnv()];

  brands.forEach((brand) => {
    const surname = `E2E-${brand}-profile-sync`;
    const firstName = `E2E-${brand}-profile-sync-first-name`;
    const email = `${firstName}@blc.co.uk`;
    const memberUuid = UUID();
    const userSyncProfileDetails = {
      gender: "F",
      uuid: memberUuid,
      email,
      brand,
      employer: "trustName",
      employer_id: "trustId",
      organisation: "NHS",
      firstname: firstName,
      email_validated: 0,
      spare_email: "",
      spare_email_validated: 0,
      surname: surname,
      dob: new Date("1990-12-23").toISOString(),
      mobile: '07700000000',
    };

    describe(`for brand ${brand}`, () => {
      let profileSortKey: string;

      beforeEach(() => {
        process.env.E2E_AWS_REGION = brand === 'BLC_AU' ? REGIONS.AP_SOUTHEAST_2 : REGIONS.EU_WEST_2;
      });

      afterEach(async () => {
        if (profileSortKey) {
          await deleteProfileItemFromIdentityTableFor(memberUuid, profileSortKey);
        }
        delete process.env.E2E_AWS_REGION;
      });

      it('should create user when "user.profile.updated" is sent and user does not yet exist', async () => {
        const userProfileUpdateEntry = {
          Entries: [
            {
              EventBusName: process.env.E2E_EVENT_BUS_NAME,
              Source: "user.profile.updated",
              DetailType: `${brand} User Profile Updated`,
              Detail: JSON.stringify(userSyncProfileDetails),
              Time: new Date(),
            },
          ],
        } as PutEventsRequest;

        const result = await putEvent(userProfileUpdateEntry);

        expect(result.$metadata.httpStatusCode).toEqual(200);
        await thenProfileDetailsWereCreatedSuccessfully();
      }, e2eTestTimeout);

      async function thenProfileDetailsWereCreatedSuccessfully(): Promise<void> {
        await waitOn(async () => {
          const profileDetails = await getItemFromIdentityTable(memberUuid, "PROFILE#");

          expect(profileDetails).toBeDefined();
          expect(profileDetails?.pk).toBe(`MEMBER#${memberUuid}`);
          expect(profileDetails?.sk).toContain(`PROFILE#`);
          profileSortKey = profileDetails?.sk;
          expect(profileDetails?.email).toBe(email);
          expect(profileDetails?.firstname).toBe(firstName);
          expect(profileDetails?.surname).toBe(surname);
          expect(profileDetails?.gender).toBe("F");
          expect(profileDetails?.dob).toBe("1990-12-23");
          expect(profileDetails?.mobile).toBe("07700000000");
          expect(profileDetails?.employer).toBe("trustName");
          expect(profileDetails?.employer_id).toBe("trustId");
          expect(profileDetails?.organisation).toBe("NHS");
          expect(profileDetails?.email_validated).toBe(0);
          expect(profileDetails?.spare_email_validated).toBe(0);
          expect(profileDetails?.spare_email).toBe("NA");
          expect(profileDetails?.merged_uid).not.toBeDefined();
          expect(profileDetails?.merged_time).not.toBeDefined();
        });
      }
    });
  });
});