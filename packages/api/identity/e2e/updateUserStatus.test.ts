import { setupE2eEnvironmentVars } from "./helpers/config";
import { PutEventsRequest } from "@aws-sdk/client-eventbridge";
import { putEvent } from "./helpers/eventbridge";
import { random } from "lodash";
import { waitOn } from "../../core/src/utils/waitOn";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { REGIONS } from "../../core/src/types/regions.enum";
import { E2E_TEST_TIMEOUT } from "./helpers/constants";
import { addUserToCognito, userExistsInCognitoWithUsername } from "./helpers/cognito";
import { createUnsuccessfulLoginItemFor, getUnsuccessfulLoginItemFor } from "./helpers/dynamo";
import { Config } from "sst/node/config";

describe('Identity: Handle Update GDPR request', () => {
  beforeAll(async () => {
    await setupE2eEnvironmentVars();
  });

  const brand = process.env.BRAND ?? "BLC_UK";
  const legacyId = random(99999, false);
  const cardId = random(99999, false);
  const firstName = `E2E-${brand}-test-name`;
  const email = `${firstName}${legacyId}@blc.co.uk`;
  const password = "TestP@assword!";

  describe(`for brand ${brand}`, () => {
    beforeEach(async () => {
      process.env.E2E_IDENTITY_COGNITO_USER_POOL_ID = Config.IDENTITY_COGNITO_USER_POOL_ID;
      process.env.E2E_AWS_REGION = brand === 'BLC_AU' ? REGIONS.AP_SOUTHEAST_2 : REGIONS.EU_WEST_2;
      await createUnsuccessfulLoginItemFor(email);
      await addUserToCognito(email, password);
    });

    afterEach(async () => {
      delete process.env.E2E_AWS_REGION;
      delete process.env.E2E_IDENTITY_COGNITO_USER_POOL_ID;
    });

    const userStatusToUpdateFor = [2, 8];

    userStatusToUpdateFor.forEach((status) => {
      it(`should delete user from cognito when "user.status.updated" is triggered with status of ${status}`, async () => {
        const updateGdprDetails = {
          brand,
          cardNumber: cardId,
          userId: legacyId,
          user_email: email,
          userStatus: 2,
        };
        const request = {
          Entries: [
            {
              EventBusName: process.env.E2E_EVENT_BUS_NAME,
              Source: "user.status.updated",
              DetailType: `${brand} User Gdpr requested`,
              Detail: JSON.stringify(updateGdprDetails),
              Time: new Date(),
            },
          ],
        } as PutEventsRequest;

        const result = await putEvent(request);

        expect(result.$metadata.httpStatusCode).toEqual(200);
        await thenUserWasDeletedSuccessfully();
      }, E2E_TEST_TIMEOUT);
    });
  });

  async function thenUserWasDeletedSuccessfully() {
    await waitOn(async () => {
      expect(await userExistsInCognitoWithUsername(email)).toBeFalsy();
      const items = await getUnsuccessfulLoginItemFor(email);
      expect(items.length).toBe(0);
    });
  }
});