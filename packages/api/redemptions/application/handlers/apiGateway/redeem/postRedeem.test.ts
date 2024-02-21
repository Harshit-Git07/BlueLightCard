// TODO(TR-187): Jest doesn't support ESM syntax, so typed-inject is not supported.
//               Switching to Vitest would allow us to write integration tests for this handler.
//               For now, we'll skip this test as configuring Jest or switching to Vitest are
//               both out of scope for this ticket.
it.todo('Implement integration tests for postRedeem');

// describe.skip('postRedeem', () => {
//   let database: RedemptionsTestDatabase;
//   let connection: DatabaseConnection;
//   beforeAll(async () => {
//     database = await RedemptionsTestDatabase.start();
//     connection = await database.getConnection();
//   }, 60_000);
//   afterEach(async () => {
//     await database?.reset();
//   });
//   afterAll(async () => {
//     await database?.down();
//   });
//   it('should return a successful response', async () => {
//     // Arrange
//     const controller = createInjector()
//       // Common
//       .provideValue(Logger.key, createTestLogger())
//       .provideValue(DatabaseConnection.key, connection)
//       // Repositories
//       .provideClass(RedemptionsRepository.key, RedemptionsRepository)
//       // Redemption strategies
//       .provideClass(RedeemGenericStrategy.key, RedeemGenericStrategy)
//       .provideClass(RedeemPreAppliedStrategy.key, RedeemPreAppliedStrategy)
//       .provideClass(RedeemShowCardStrategy.key, RedeemShowCardStrategy)
//       .provideClass(RedeemVaultQrStrategy.key, RedeemVaultQrStrategy)
//       .provideClass(RedeemVaultStrategy.key, RedeemVaultStrategy)
//       .provideClass(RedeemStrategyResolver.key, RedeemStrategyResolver)
//       // API Service
//       .provideClass(RedeemService.key, RedeemService)
//       // Controller
//       .injectClass(RedeemController);
//     const requestBody: PostRedeemModel = {
//       offerId: faker.number.int({
//         min: 1,
//         max: 1_000_000,
//       }),
//     };
//     const request = apiGatewayProxyEventV2Factory.build({
//       body: JSON.stringify(requestBody),
//     });
//     await connection.db.insert(redemptionsTable).values(redemptionFactory.build({
//       offerId: requestBody.offerId,
//     }));
//     // Act
//     const result = await controller.invoke(request);
//     // Assert
//     expect(result).toEqual({
//       statusCode: 200,
//       body: {
//         statusCode: 200,
//         data: {
//           redemptionType: 'generic',
//           redemptionDetails: {},
//         },
//       },
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   });
// });
