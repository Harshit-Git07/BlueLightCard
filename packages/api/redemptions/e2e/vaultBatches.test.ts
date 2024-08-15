// import { faker } from '@faker-js/faker';
// import AWS from 'aws-sdk';
// import { eq } from 'drizzle-orm';
// import { ApiGatewayV1Api } from 'sst/node/api';
// import { afterAll, beforeAll, describe, expect, it } from 'vitest';
//
// import { DatabaseConnectionType } from '../libs/database/connection';
// import { redemptionsTable, vaultBatchesTable, vaultCodesTable, vaultsTable } from '../libs/database/schema';
// import { redemptionFactory } from '../libs/test/factories/redemption.factory';
// import { vaultFactory } from '../libs/test/factories/vault.factory';
// import { vaultBatchFactory } from '../libs/test/factories/vaultBatches.factory';
// import { vaultCodeFactory } from '../libs/test/factories/vaultCode.factory';
//
// import { E2EDatabaseConnectionManager } from './helpers/database';
//
// describe('Vault Batch admin API tests', () => {
//   let connectionManager: E2EDatabaseConnectionManager;
//   let apiKey: string;
//   const defaultRedemption = redemptionFactory.build();
//   const defaultVault = vaultFactory.build({ redemptionId: defaultRedemption.id });
//   const defaultVaultBatch = vaultBatchFactory.build({ vaultId: defaultVault.id });
//   const defaultVaultCodes = vaultCodeFactory.buildList(5, {
//     vaultId: defaultVault.id,
//     batchId: defaultVaultBatch.id,
//     memberId: null,
//   });
//
//   beforeAll(async () => {
//     // eslint-disable-next-line no-console
//     connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);
//     const APIGateway = new AWS.APIGateway();
//     const keyLookup = `${process.env.SST_STAGE}-redemptions-admin`;
//     apiKey = await new Promise((resolve) => {
//       APIGateway.getApiKeys({ nameQuery: keyLookup, includeValues: true }, (_err, data) => {
//         if (!data.items![0].value) {
//           throw new Error('Unable to find API key: ' + keyLookup);
//         }
//
//         resolve(data.items![0].value);
//       });
//     });
//
//     // Set a conservative timeout
//   }, 60_000);
//
//   afterAll(async () => {
//     await connectionManager.connection.db.delete(vaultCodesTable).where(eq(vaultCodesTable.vaultId, defaultVault.id));
//     await connectionManager.connection.db
//       .delete(vaultBatchesTable)
//       .where(eq(vaultBatchesTable.id, defaultVaultBatch.id));
//
//     await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, defaultVault.id));
//     await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, defaultRedemption.id));
//   });
//
//   describe('PATCH Vault Batches', () => {
//     describe('API key authentication', () => {
//       it('responds with an authorisation error if no key is provided', async () => {
//         const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             batchId: `vbt-${faker.string.uuid()}`,
//             expiry: faker.date.future().toISOString(),
//           }),
//         });
//
//         expect(result.status).toBe(403);
//       });
//
//       it('responds with an authorisation error if the wrong key is provided', async () => {
//         const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-API-Key': 'probably-not-this-one',
//           },
//           body: JSON.stringify({
//             batchId: `vbt-${faker.string.uuid()}`,
//             expiry: faker.date.future().toISOString(),
//           }),
//         });
//
//         expect(result.status).toBe(403);
//       });
//
//       it('responds with a bad request error if the body is invalid', async () => {
//         const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             'x-api-key': apiKey,
//           },
//           body: JSON.stringify({
//             batchId: `vbt-${faker.string.uuid()}`,
//           }),
//         });
//
//         expect(result.status).toBe(400);
//       });
//
//       it('responds with a not found error if the batch does not exist', async () => {
//         const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             'x-api-key': apiKey,
//           },
//           body: JSON.stringify({
//             batchId: `vbt-non-existent`,
//             expiry: faker.date.future().toISOString(),
//           }),
//         });
//
//         expect(result.status).toBe(404);
//       });
//
//       it('responds with no content if the batch and codes are updated', async () => {
//         await connectionManager.connection.db.insert(redemptionsTable).values(defaultRedemption);
//         await connectionManager.connection.db.insert(vaultsTable).values(defaultVault);
//         await connectionManager.connection.db.insert(vaultBatchesTable).values(defaultVaultBatch);
//         await connectionManager.connection.db.insert(vaultCodesTable).values(defaultVaultCodes);
//
//         const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-API-Key': apiKey,
//           },
//           body: JSON.stringify({
//             batchId: defaultVaultBatch.id,
//             expiry: faker.date.future().toISOString(),
//           }),
//         });
//
//         expect(result.status).toStrictEqual(204);
//       });
//     });
//   });
// });
