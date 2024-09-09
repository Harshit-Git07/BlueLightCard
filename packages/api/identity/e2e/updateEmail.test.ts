import { PutEventsRequest } from '@aws-sdk/client-eventbridge';
import { putEvent } from './helpers/eventbridge';
import { random } from 'lodash';
import { waitOn } from '../../core/src/utils/waitOn';
import { beforeEach, describe, expect, it } from 'vitest';
import { REGIONS } from '../../core/src/types/regions.enum';
import { E2E_TEST_TIMEOUT } from './helpers/constants';
import { addUserToCognito, userExistsInCognitoWithUsername } from './helpers/cognito';
import { createUnsuccessfulLoginItemFor, getUnsuccessfulLoginItemFor } from './helpers/dynamo';
import { Config } from 'sst/node/config';

describe('Identity: Update email', () => {
  const brand = process.env.BRAND ?? 'BLC_UK';
  const legacyId = random(99999, false);
  const firstName = `E2E-${brand}-test-name`;
  const email = `${firstName}${legacyId}@blc.co.uk`;
  const password = 'TestP@assword!';
  const updateEmailDetails = {
    user_email: email,
    brand,
    userId: legacyId,
  };

  const region = brand === 'BLC_AU' ? REGIONS.AP_SOUTHEAST_2 : REGIONS.EU_WEST_2;
  const eventBusName = Config.SHARED_EVENT_BUS_NAME;
  const identityCognitoUserPoolId = Config.IDENTITY_COGNITO_USER_POOL_ID;
  const unsuccessfulLoginAttemptsTableName = Config.UNSUCCESSFUL_LOGIN_ATTEMPTS_TABLE_NAME;

  describe(`for brand ${brand}`, () => {
    beforeEach(async () => {
      await addUserToCognito(email, password, region, identityCognitoUserPoolId);
      await createUnsuccessfulLoginItemFor(
        email,
        region,
        unsuccessfulLoginAttemptsTableName,
        identityCognitoUserPoolId,
      );
    });

    it(
      'should delete user from cognito when "user.email.updated" is triggered',
      async () => {
        const request = {
          Entries: [
            {
              EventBusName: eventBusName,
              Source: 'user.email.updated',
              DetailType: `${brand} User email updated`,
              Detail: JSON.stringify(updateEmailDetails),
              Time: new Date(),
            },
          ],
        } as PutEventsRequest;

        const result = await putEvent(request, region);

        expect(result.$metadata.httpStatusCode).toEqual(200);
        await thenUserWasDeletedSuccessfully();
      },
      E2E_TEST_TIMEOUT,
    );
  });

  async function thenUserWasDeletedSuccessfully() {
    await waitOn(async () => {
      expect(
        await userExistsInCognitoWithUsername(email, region, identityCognitoUserPoolId),
      ).toBeFalsy();
      const items = await getUnsuccessfulLoginItemFor(
        email,
        region,
        unsuccessfulLoginAttemptsTableName,
        identityCognitoUserPoolId,
      );
      expect(items.length).toBe(0);
    });
  }
});
