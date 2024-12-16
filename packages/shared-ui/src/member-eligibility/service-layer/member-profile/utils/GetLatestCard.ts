import {
  ServiceLayerMemberProfile,
  ServiceLayerMemberProfileCard,
} from '../types/ServiceLayerMemberProfile';

export function getLatestCard(
  memberProfile: ServiceLayerMemberProfile,
): ServiceLayerMemberProfileCard | undefined {
  return memberProfile.cards.at(-1);
}
