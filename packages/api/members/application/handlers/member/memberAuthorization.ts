import { APIGatewayEvent, APIGatewayProxyEvent } from 'aws-lambda';

// TODO: Turn this on once authentication is implemented
export function verifyMemberHasAccessToProfile(event: APIGatewayProxyEvent, memberId: string) {
  // if (event.requestContext.identity.user !== memberId) {
  //   throw new NotAuthorizedError('Member does not have access to this profile');
  // }
}
