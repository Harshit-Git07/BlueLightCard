import { setupE2eEnvironmentVars } from "./helpers/config";
import { PutEventsRequest } from "@aws-sdk/client-eventbridge";
import { putEvent } from "./helpers/eventbridge";
import { v4 as UUID } from "uuid";
import {
  createCardItemInIdentityTableFor,
  deleteCardItemFromIdentityTableFor,
  getItemFromIdentityTable
} from "./helpers/dynamo";
import { waitOn } from "../../core/src/utils/waitOn";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { REGIONS } from "../../core/src/types/regions.enum";
import { getBrandFromEnv } from "../../core/src/utils/checkBrand";
import { isLocal } from "../../core/src/utils/checkEnvironment";
import { Config } from "sst/node/config";
import { CardStatus } from "../../core/src/types/cardStatus.enum";
import { random } from "lodash";
import { E2E_TEST_TIMEOUT } from "./helpers/constants";

describe('Identity: User Card Sync', () => {
  beforeAll(async () => {
    await setupE2eEnvironmentVars();
  });

  const brands = isLocal(Config.STAGE) ? ['BLC_UK', 'DDS_UK', 'BLC_AU'] : [getBrandFromEnv()];

  brands.forEach((brand) => {
    const cardId = random(99999, false);
    const memberUuid = UUID();
    const cardDetails = {
      uuid: memberUuid,
      cardNumber: cardId,
      cardStatus: 4,
      expires: new Date("2060-12-23").toISOString(),
      posted: new Date("2024-01-01").toISOString(),
      brand,
    };

    describe(`for brand ${brand}`, () => {
      beforeEach(() => {
        process.env.E2E_AWS_REGION = brand === 'BLC_AU' ? REGIONS.AP_SOUTHEAST_2 : REGIONS.EU_WEST_2;
      });

      afterEach(async () => {
        await deleteCardItemFromIdentityTableFor(memberUuid, cardId);
        delete process.env.E2E_AWS_REGION;
      });

      it('should create card item when "user.card.status.updated" is sent and card does not yet exist', async () => {
        const cardUpdate = {
          Entries: [
            {
              EventBusName: process.env.E2E_EVENT_BUS_NAME,
              Source: "user.card.status.updated",
              DetailType: `${brand} User Card Status Updated`,
              Detail: JSON.stringify(cardDetails),
              Time: new Date(),
            },
          ],
        } as PutEventsRequest;

        const result = await putEvent(cardUpdate);

        expect(result.$metadata.httpStatusCode).toEqual(200);
        await thenCardDetailsWereUpdatedSuccessfully();
      }, E2E_TEST_TIMEOUT);

      it('should update card item when "user.card.status.updated" is sent and card already exists with default values', async () => {
        const defaultDateValue = "0000000000000000"
        await createCardItemInIdentityTableFor(memberUuid, cardId, CardStatus.AWAITING_ID, defaultDateValue, defaultDateValue);
        const cardUpdate = {
          Entries: [
            {
              EventBusName: process.env.E2E_EVENT_BUS_NAME,
              Source: "user.card.status.updated",
              DetailType: `${brand} User Card Status Updated`,
              Detail: JSON.stringify(cardDetails),
              Time: new Date(),
            },
          ],
        } as PutEventsRequest;

        const result = await putEvent(cardUpdate);

        expect(result.$metadata.httpStatusCode).toEqual(200);
        await thenCardDetailsWereUpdatedSuccessfully();
      }, E2E_TEST_TIMEOUT);

      it('should update card dates when "user.card.status.updated" is sent and card already exists with older expiry date and default posted date', async () => {
        const defaultDateValue = "0000000000000000"
        const oldDate = "111111111111"
        await createCardItemInIdentityTableFor(memberUuid, cardId, CardStatus.AWAITING_ID, oldDate, defaultDateValue);
        const cardUpdate = {
          Entries: [
            {
              EventBusName: process.env.E2E_EVENT_BUS_NAME,
              Source: "user.card.status.updated",
              DetailType: `${brand} User Card Status Updated`,
              Detail: JSON.stringify(cardDetails),
              Time: new Date(),
            },
          ],
        } as PutEventsRequest;

        const result = await putEvent(cardUpdate);

        expect(result.$metadata.httpStatusCode).toEqual(200);
        await thenCardDetailsWereUpdatedSuccessfully();
      }, E2E_TEST_TIMEOUT);

      async function thenCardDetailsWereUpdatedSuccessfully(): Promise<void> {
        await waitOn(async () => {
          const cardDetails = await getItemFromIdentityTable(memberUuid, "CARD#");

          expect(cardDetails).toBeDefined();
          expect(cardDetails?.pk).toBe(`MEMBER#${memberUuid}`);
          expect(cardDetails?.sk).toBe(`CARD#${cardId}`);
          expect(cardDetails?.status).toBe(CardStatus.ADDED_TO_BATCH);
          expect(cardDetails?.cardPrefix).not.toBeDefined();
          expect(cardDetails?.expires).toBe("2870985600000");
          expect(cardDetails?.posted).toBe("1704067200000");
        });
      }
    });
  });
});