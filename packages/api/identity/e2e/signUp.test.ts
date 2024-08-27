import { setupE2eEnvironmentVars } from "./helpers/config";
import { PutEventsRequest } from "@aws-sdk/client-eventbridge";
import { putEvent } from "./helpers/eventbridge";
import { v4 as UUID } from "uuid";
import {
  deleteItemFromIdMappingTableFor,
  deleteItemsFromIdentityTableFor,
  getItemFromIdentityTable,
  getItemFromIdMappingTable
} from "./helpers/dynamo";
import { CardStatus } from "../../core/src/types/cardStatus.enum";
import { random } from "lodash";
import { waitOn } from "../../core/src/utils/waitOn";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { REGIONS } from "../../core/src/types/regions.enum";
import { getBrandFromEnv } from "../../core/src/utils/checkBrand";
import { isLocal } from "../../core/src/utils/checkEnvironment";
import { Config } from "sst/node/config";
import { E2E_TEST_TIMEOUT } from "./helpers/constants";

describe('Identity: User Sign up and Migration', () => {
  beforeAll(async () => {
    await setupE2eEnvironmentVars();
  });

  const brands = isLocal(Config.STAGE) ? ['BLC_UK', 'DDS_UK', 'BLC_AU'] : [getBrandFromEnv()];

  brands.forEach((brand) => {
    const memberUuid = UUID();
    const profileUuid = UUID();
    const legacyId = random(99999, false);
    const cardId = random(99999, false);
    const surname = `E2E-${brand}-test-surname`;
    const firstName = `E2E-${brand}-test-first-name`;
    const email = `${firstName}@blc.co.uk`;
    const userSignUpDetails = {
      gender: 'F',
      uuid: memberUuid,
      profileUuid: profileUuid,
      legacyUserId: legacyId,
      cardId: cardId,
      brand: brand,
      name: firstName,
      surname: surname,
      dob: '1990-12-01',
      mobile: '07000000000',
      email: email,
      emailValidated: 0,
      service: 'NHS',
      county: 'Antrim',
      trustId: 'trustId',
      trustName: 'trustName',
      merged_uid: '0',
      cardExpires: new Date("2060-12-23").toISOString(),
      cardPosted: new Date("2024-01-01").toISOString(),
      cardStatus: 1,
    };

    describe(`for brand ${brand}`, () => {
      beforeEach(() => {
        process.env.E2E_AWS_REGION = brand === 'BLC_AU' ? REGIONS.AP_SOUTHEAST_2 : REGIONS.EU_WEST_2;
      });

      afterEach(async () => {
        await deleteItemsFromIdentityTableFor(memberUuid, brand, cardId, profileUuid);
        await deleteItemFromIdMappingTableFor(memberUuid, brand, legacyId);
        delete process.env.E2E_AWS_REGION;
      });

      it('should add user to identity table when "user.signup" is sent', async () => {
        const userDetailsEntry = {
          Entries: [
            {
              EventBusName: process.env.E2E_EVENT_BUS_NAME,
              Source: "user.signup",
              DetailType: `${brand} User signup`,
              Detail: JSON.stringify(userSignUpDetails),
              Time: new Date(),
            },
          ],
        } as PutEventsRequest;

        const result = await putEvent(userDetailsEntry);

        expect(result.$metadata.httpStatusCode).toEqual(200);
        await thenUserWasAddedSuccessfully();
      }, E2E_TEST_TIMEOUT);

      it('should add user to identity table when "user.signin.migrated" is sent', async () => {
        const userDetailsEntry = {
          Entries: [
            {
              EventBusName: process.env.E2E_EVENT_BUS_NAME,
              Source: "user.signin.migrated",
              DetailType: `${brand} User Sign In Migrated`,
              Detail: JSON.stringify(userSignUpDetails),
              Time: new Date(),
            },
          ],
        } as PutEventsRequest;

        const result = await putEvent(userDetailsEntry);

        expect(result.$metadata.httpStatusCode).toEqual(200);
        await thenUserWasAddedSuccessfully();
      }, E2E_TEST_TIMEOUT);
    });

    async function thenUserWasAddedSuccessfully() {
      await waitOn(async () => {
        await thenBrandDetailsWereAddedSuccessfully();
        await thenCardDetailsWereAddedSuccessfully();
        await thenProfileDetailsWereAddedSuccessfully();
        await thenIdMappingWasAddedSuccessfully();
      });
    }

    async function thenBrandDetailsWereAddedSuccessfully(): Promise<void> {
      const brandDetails = await getItemFromIdentityTable(memberUuid, "BRAND#");

      expect(brandDetails).toBeDefined();
      expect(brandDetails?.pk).toBe(`MEMBER#${memberUuid}`);
      expect(brandDetails?.legacy_id).toBe(legacyId);
      expect(brandDetails?.sk).toBe(`BRAND#${brand}`);
    }

    async function thenIdMappingWasAddedSuccessfully(): Promise<void> {
      const idMappingDetails = await getItemFromIdMappingTable(brand, legacyId, memberUuid);

      expect(idMappingDetails).toBeDefined();
      expect(idMappingDetails?.legacy_id).toBe(`BRAND#${brand}#${legacyId}`);
      expect(idMappingDetails?.uuid).toBe(memberUuid);
    }

    async function thenCardDetailsWereAddedSuccessfully(): Promise<void> {
      const cardDetails = await getItemFromIdentityTable(memberUuid, "CARD#");

      expect(cardDetails).toBeDefined();
      expect(cardDetails?.pk).toBe(`MEMBER#${memberUuid}`);
      expect(cardDetails?.sk).toBe(`CARD#${cardId}`);
      expect(cardDetails?.status).toBe(CardStatus.AWAITING_ID);
      expect(cardDetails?.cardPrefix).not.toBeDefined();
      expect(cardDetails?.expires).toBe("2060-12-23T00:00:00.000Z");
      expect(cardDetails?.posted).toBe("2024-01-01T00:00:00.000Z");
    }

    async function thenProfileDetailsWereAddedSuccessfully(): Promise<void> {
      const profileDetails = await getItemFromIdentityTable(memberUuid, "PROFILE#");

      expect(profileDetails).toBeDefined();
      expect(profileDetails?.pk).toBe(`MEMBER#${memberUuid}`);
      expect(profileDetails?.sk).toBe(`PROFILE#${profileUuid}`);
      expect(profileDetails?.email).toBe(email);
      expect(profileDetails?.firstname).toBe(firstName);
      expect(profileDetails?.surname).toBe(surname);
      expect(profileDetails?.gender).toBe("F");
      expect(profileDetails?.dob).toBe("1990-12-01");
      expect(profileDetails?.mobile).toBe("07000000000");
      expect(profileDetails?.employer).toBe("trustName");
      expect(profileDetails?.employer_id).toBe("trustId");
      expect(profileDetails?.merged_uid).toBe("0");
      expect(profileDetails?.organisation).toBe("NHS");
      expect(profileDetails?.email_validated).toBe(0);
      expect(profileDetails?.spare_email).toBe("NA");
      expect(profileDetails?.spare_email_validated).not.toBeDefined();
      expect(profileDetails?.merged_time).not.toBeDefined();
    }
  });
});