import { describe, expect, test } from '@jest/globals';
import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { UserService } from '../UserService';
import { UserRepository } from 'src/repositories/userRepository';
import { Logger } from '@aws-lambda-powertools/logger';

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn().mockReturnValue({ client_id: 1234, 'custom:blc_old_uuid': 'testUUID' }),
}));

let dynamoMock: ReturnType<typeof mockClient>;
  describe('User Profile, Brand and Card data', () => {
    let userService: UserService;
    const MOCK_UUID: string = '068385bb-b370-4153-9474-51dd0bfac9dc';

    beforeEach(() => {
      jest.clearAllMocks();
      userService = new UserService('mockTableName', 'mockRegion', new Logger());
      userService.userRepository = new UserRepository('mockTableName', 'mockRegion');
      const queryCommandOutput:QueryCommandOutput = {
        Items: [
          {
            "sk": "BRAND#BLC_UK",
            "legacy_id": 2853201,
            "pk": `MEMBER#${MOCK_UUID}`,
          },
          {
            "sk": "CARD#3470584",
            "expires": "1758365897",
            "pk": `MEMBER#${MOCK_UUID}`,
            "posted": "1695220641",
            "status": "PHYSICAL_CARD"
          },
          {
            "sk": "COMPANYFOLLOWS#123",
            "pk": `MEMBER#${MOCK_UUID}`,
            "likeType": "Like",
          },
          {
            "email": "rlimbu+work1@bluelightcard.co.uk",
            "spare_email": "rlimbu+work1@bluelightcard.co.uk",
            "merged_uid": false,
            "organisation": "AMBU",
            "employer_id": "0",
            "gender": "F",
            "email_validated": 1,
            "spare_email_validated": 1,
            "mobile": "+447915507274",
            "surname": "limbu",
            "ga_key": " ",
            "dob": null,
            "merged_time": "0000000000000000",
            "firstname": "rubi",
            "sk": "PROFILE#52864f27-082e-41eb-89cb-b9f5e0b218ec",
            "employer": " ",
            "pk": `MEMBER#${MOCK_UUID}`,
          },
        ],
        $metadata: {},
      }
      jest.spyOn(UserRepository.prototype, 'findItemsByUuid').mockResolvedValue(queryCommandOutput);
    });

    test('Response is valid when data is found in DB', async () => {
      const res = await userService.findUserDetails(MOCK_UUID);
      // expect(dynamoMock.calls()).toHaveLength(1);
      expect(res).toEqual({"brand": "BLC_UK", "canRedeemOffer": true, "cards": [{"cardId": "3470584", "cardPrefix": undefined, "cardStatus": "PHYSICAL_CARD", "datePosted": "1695220641", "expires": "1758365897"}], "companies_follows": [{"companyId": "123", "likeType": "Like"}], "legacyId": 2853201, "profile": {"dob": null, "email": "rlimbu+work1@bluelightcard.co.uk", "emailValidated": 1, "firstname": "rubi", "gender": "F", "mobile": "+447915507274", "organisation": "AMBU", "service": undefined, "spareEmail": "rlimbu+work1@bluelightcard.co.uk", "spareEmailValidated": 1, "surname": "limbu", "twoFactorAuthentication": false, "uuid": undefined}, "uuid": "068385bb-b370-4153-9474-51dd0bfac9dc"});
    });

    test('Card with null id is removed from the response', async () => {

      const queryCommandOutput:QueryCommandOutput = {
        Items: [
          {
            "sk": "BRAND#BLC_UK",
            "legacy_id": 2853201,
            "pk": `MEMBER#${MOCK_UUID}`,
          },
          {
            "sk": "CARD#3470584",
            "expires": "1758365897",
            "pk": `MEMBER#${MOCK_UUID}`,
            "posted": "1695220641",
            "status": "PHYSICAL_CARD"
          },
          {
            "sk": "CARD#null",
            "expires": "1758365897",
            "pk": `MEMBER#${MOCK_UUID}`,
            "posted": "1695220641",
            "status": "PHYSICAL_CARD"
          },
          {
            "sk": "COMPANYFOLLOWS#123",
            "pk": `MEMBER#${MOCK_UUID}`,
            "likeType": "Like",
          },
          {
            "email": "rlimbu+work1@bluelightcard.co.uk",
            "spare_email": "rlimbu+work1@bluelightcard.co.uk",
            "merged_uid": false,
            "organisation": "AMBU",
            "employer_id": "0",
            "gender": "F",
            "email_validated": 1,
            "spare_email_validated": 1,
            "mobile": "+447915507274",
            "surname": "limbu",
            "ga_key": " ",
            "dob": null,
            "merged_time": "0000000000000000",
            "firstname": "rubi",
            "sk": "PROFILE#52864f27-082e-41eb-89cb-b9f5e0b218ec",
            "employer": " ",
            "pk": `MEMBER#${MOCK_UUID}`,
          }
        ],
        $metadata: {}
      }

      jest.spyOn(UserRepository.prototype, 'findItemsByUuid').mockResolvedValue(queryCommandOutput);

      const res = await userService.findUserDetails(MOCK_UUID);

      expect(res).toEqual({"brand": "BLC_UK", "canRedeemOffer": true, "cards": [{"cardId": "3470584", "cardPrefix": undefined, "cardStatus": "PHYSICAL_CARD", "datePosted": "1695220641", "expires": "1758365897"}], "companies_follows": [{"companyId": "123", "likeType": "Like"}], "legacyId": 2853201, "profile": {"dob": null, "email": "rlimbu+work1@bluelightcard.co.uk", "emailValidated": 1, "firstname": "rubi", "gender": "F", "mobile": "+447915507274", "organisation": "AMBU", "service": undefined, "spareEmail": "rlimbu+work1@bluelightcard.co.uk", "spareEmailValidated": 1, "surname": "limbu", "twoFactorAuthentication": false, "uuid": undefined}, "uuid": "068385bb-b370-4153-9474-51dd0bfac9dc"});
    });

    test('Returns null when user is not found', async () => {
      const queryCommandOutput: QueryCommandOutput = {
        Items: [],
        $metadata: {},
      };
      jest.spyOn(UserRepository.prototype, 'findItemsByUuid').mockResolvedValue(queryCommandOutput);

      const res = await userService.findUserDetails(MOCK_UUID);

      expect(res).toEqual(null);
    });
});
