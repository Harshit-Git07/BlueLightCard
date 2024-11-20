export const ORGANISATION = 'ORGANISATION';
export const EMPLOYER = 'EMPLOYER';
export const MEMBER = 'MEMBER';
export const PROFILE = 'PROFILE';
export const APPLICATION = 'APPLICATION';
export const CARD = 'CARD';

export function organisationKey(organisationId: string): string {
  return `${ORGANISATION}#${organisationId}`;
}

export function employerKey(employerId: string): string {
  return `${EMPLOYER}#${employerId}`;
}

export function memberKey(memberId: string): string {
  return `${MEMBER}#${memberId}`;
}

export function applicationKey(applicationId: string): string {
  return `${APPLICATION}#${applicationId}`;
}

export function cardKey(cardNumber: string): string {
  return `${CARD}#${cardNumber}`;
}
