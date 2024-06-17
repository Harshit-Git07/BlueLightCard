export const userEmailUpdatedRule = (
  userPoolId: string,
  ddsUserPoolId: string,
  region: string,
  oldUserPoolId: string,
  oldDdsUserPoolId: string,
) => ({
  userEmailUpdatedRule: {
    pattern: {
      source: ['user.email.updated.v2'],
    },
    targets: {
      userEmailUpdateFunction: {
        function: {
          permissions: [
            'cognito-idp:AdminDeleteUser',
            'cognito-idp:AdminGetUser',
            'cognito-idp:AdminUpdateUserAttributes',
          ],
          handler: 'packages/api/identity/src/eventRules/updateUserEmailHandler.handler',
          environment: {
            USER_POOL_ID: userPoolId,
            USER_POOL_ID_DDS: ddsUserPoolId,
            OLD_USER_POOL_ID: oldUserPoolId,
            OLD_USER_POOL_ID_DDS: oldDdsUserPoolId,
            SERVICE: 'identity',
            REGION: region,
          },
          retryAttepmts: 0,
        },
      },
    },
  },
});
