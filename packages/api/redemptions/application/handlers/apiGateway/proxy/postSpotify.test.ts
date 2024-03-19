it.todo('Implement integration tests for postSpotify');
// import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
// import { afterAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
// import { mocked } from 'jest-mock';

// import { httpRequest } from '@blc-mono/core/utils/fetch/httpRequest';
// import { getEnv } from '@blc-mono/core/utils/getEnv';
// import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

// import { handler, IAPIGatewayEvent } from './PostSpotify';

// jest.mock('@blc-mono/core/utils/fetch/httpRequest');
// jest.mock('@blc-mono/core/utils/getEnv');

// const mockedHttpRequest = mocked(httpRequest);
// const mockedGetEnv = mocked(getEnv);

// function mockEnvVariables(overrides?: Partial<Record<string, string>>) {
//   return mockedGetEnv.mockImplementation((key: string) => {
//     const value = overrides?.[key];
//     if (value) return value;
//     switch (key) {
//       case RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST:
//         return 'http://url-test.com';
//       case RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT:
//         return 'test';
//       case RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODE_REDEEMED_PATH:
//         return 'codeRedeemed';
//       case RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH:
//         return 'assignedUserCode';
//     }
//     throw new Error('Invalid environment variable');
//   });
// }

// describe('Spotify Proxy Handler', () => {
//   const platform = 'test-platform';
//   const companyId = 12345;
//   const offerId = 1224;
//   const memberId = '3444';
//   const url = 'http://url-test.com?code=!!!CODE!!!';
//   const trackingUrl = 'http://url-test.com?code=1234';
//   const code = 1234;
//   const headers = {
//     'Access-Control-Allow-Origin': '*',
//     'Content-Type': 'application/json',
//   };
//   const statusCode = 200;

//   const defaultExpectedResponse = {
//     body: {},
//     headers,
//     statusCode,
//   };

//   afterAll(() => {
//     jest.resetAllMocks();
//   });

//   describe('200s', () => {
//     test('should return 200 for a user who already code that exist', async () => {
//       mockEnvVariables();

//       jest.spyOn(SecretsManagerClient.prototype, 'send').mockImplementation(() => {
//         return {
//           SecretString: JSON.stringify({
//             codeRedeemedData: 'NewVault/assignUserCodes',
//             codeRedeemedPassword: 'sjDpKVBt^FxCzq8y',
//             assignUserCodesData: 'NewVault/assignUserCodes',
//             assignUserCodesPassword: 'sjDpKVBt^FxCzq8y',
//           }),
//         };
//       });

//       const expectedBody = JSON.stringify({
//         message: 'Success',
//         data: {
//           trackingUrl,
//           code,
//         },
//       });
//       const expectedResponse = {
//         ...defaultExpectedResponse,
//         body: expectedBody,
//       };
//       mockedHttpRequest.mockResolvedValueOnce({
//         status: 200,
//         data: {
//           data: [{ code }],
//         },
//       });

//       const requestBody = {
//         platform,
//         companyId,
//         offerId,
//         memberId,
//         url,
//       };

//       const event: Partial<IAPIGatewayEvent> = {
//         body: JSON.stringify(requestBody),
//       };
//       const res = await handler(event as IAPIGatewayEvent);
//       expect(res).toEqual(expectedResponse);
//     });

//     test('should return 200 for a user who already code does not exist', async () => {
//       mockEnvVariables();

//       jest.spyOn(SecretsManagerClient.prototype, 'send').mockImplementation(() => {
//         return {
//           SecretString: JSON.stringify({
//             codeRedeemedData: 'NewVault/assignUserCodes',
//             codeRedeemedPassword: 'sjDpKVBt^FxCzq8y',
//             assignUserCodesData: 'NewVault/assignUserCodes',
//             assignUserCodesPassword: 'sjDpKVBt^FxCzq8y',
//           }),
//         };
//       });

//       const expectedBody = JSON.stringify({
//         message: 'Success',
//         data: {
//           trackingUrl,
//           code,
//           dwh: true,
//         },
//       });
//       const expectedResponse = {
//         ...defaultExpectedResponse,
//         body: expectedBody,
//       };

//       mockedHttpRequest.mockResolvedValueOnce({
//         status: 200,
//         data: {
//           data: [],
//         },
//       });

//       mockedHttpRequest.mockResolvedValueOnce({
//         status: 200,
//         data: {
//           data: {
//             code: 1234,
//           },
//         },
//       });

//       const requestBody = {
//         platform,
//         companyId,
//         offerId,
//         memberId,
//         url,
//       };

//       const event: Partial<IAPIGatewayEvent> = {
//         body: JSON.stringify(requestBody),
//       };
//       const res = await handler(event as IAPIGatewayEvent);
//       expect(res).toEqual(expectedResponse);
//     });
//   });
//   describe('400s', () => {
//     test('should return a 400 codee when the response return an empty object', async () => {
//       mockEnvVariables({
//         [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST]: 'http://wrong-url',
//       });

//       const expectedBody = JSON.stringify({
//         message: 'Not found',
//       });
//       const expectedResponse = {
//         ...defaultExpectedResponse,
//         body: expectedBody,
//         statusCode: 404,
//       };

//       mockedHttpRequest.mockResolvedValueOnce({
//         status: 404,
//         data: {},
//       });

//       const requestBody = {
//         platform,
//         companyId,
//         offerId,
//         memberId,
//         url,
//       };

//       const event: Partial<IAPIGatewayEvent> = {
//         body: JSON.stringify(requestBody),
//       };
//       const res = await handler(event as IAPIGatewayEvent);
//       expect(res).toEqual(expectedResponse);
//     });

//     test('should return a 404 codee when the response returns undefined', async () => {
//       mockEnvVariables({
//         [RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST]: 'http://wrong-url',
//       });

//       const expectedBody = JSON.stringify({
//         message: 'Not found',
//       });
//       const expectedResponse = {
//         ...defaultExpectedResponse,
//         body: expectedBody,
//         statusCode: 404,
//       };

//       mockedHttpRequest.mockResolvedValueOnce({
//         status: 404,
//         data: {},
//       });

//       const requestBody = {
//         platform,
//         companyId,
//         offerId,
//         memberId,
//         url,
//       };

//       const event: Partial<IAPIGatewayEvent> = {
//         body: JSON.stringify(requestBody),
//       };
//       const res = await handler(event as IAPIGatewayEvent);
//       expect(res).toEqual(expectedResponse);
//     });
//   });
//   describe('500s', () => {
//     test('should return a 500 when an unexpected error happens', async () => {
//       mockEnvVariables();

//       const expectedResponse = {
//         ...defaultExpectedResponse,
//         body: JSON.stringify({ message: 'Error', error: 'Error while creating Spotify code.' }),
//         statusCode: 500,
//       };

//       mockedHttpRequest.mockImplementation(() => {
//         throw new Error('an error has happened');
//       });

//       const event: Partial<IAPIGatewayEvent> = {
//         body: JSON.stringify({}),
//       };
//       expect(handler(event as IAPIGatewayEvent)).resolves.toEqual(expectedResponse);
//     });
//   });

//   describe('environments variables', () => {
//     beforeEach(() => {
//       jest.resetModules();
//       jest.resetAllMocks();
//       jest.clearAllMocks();
//     });

//     test('should validate environment variables', async () => {
//       mockedGetEnv.mockImplementationOnce(() => {
//         throw new Error('Invalid environment variable');
//       });

//       jest.spyOn(SecretsManagerClient.prototype, 'send').mockImplementation(() => {
//         return {
//           SecretString: JSON.stringify({
//             codeRedeemedData: 'NewVault/assignUserCodes',
//             codeRedeemedPassword: 'sjDpKVBt^FxCzq8y',
//             assignUserCodesData: 'NewVault/assignUserCodes',
//             assignUserCodesPassword: 'sjDpKVBt^FxCzq8y',
//           }),
//         };
//       });

//       const event: Partial<IAPIGatewayEvent> = {
//         body: JSON.stringify({}),
//       };

//       await expect(() => handler(event as IAPIGatewayEvent)).rejects.toThrow();
//     });
//   });
// });
