import {
  ServiceLayerMemberProfile,
  ServiceLayerMemberProfileCard,
} from '@/root/src/member-eligibility/shared/hooks/use-member-profile/types/ServiceLayerMemberProfile';

export function getLatestCard(
  memberProfile: ServiceLayerMemberProfile
): ServiceLayerMemberProfileCard | undefined {
  return memberProfile.cards?.at(-1);
}
