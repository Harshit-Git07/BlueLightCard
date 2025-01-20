import { APIGatewayProxyEvent } from 'aws-lambda';

// TODO: Turn this on once authentication is implemented, and remove the eslint disable line
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function verifyMemberHasAccessToProfile(event: APIGatewayProxyEvent, memberId: string) {
  // if (event.requestContext.identity.user !== memberId) {
  //   throw new NotAuthorizedError('Member does not have access to this profile');
  // }
}
