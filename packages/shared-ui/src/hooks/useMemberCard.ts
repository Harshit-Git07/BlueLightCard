import useMemberProfileGet from './useMemberProfileGet';
import { getCardAgeInDays } from '../utils/cardUtils';

export const reprintPeriodInDays = 90;

const useMemberCard = (memberId: string) => {
  const { isLoading, memberProfile } = useMemberProfileGet(memberId);
  const cards = memberProfile?.cards ?? [];
  const card = cards.length ? cards[cards.length - 1] : undefined;

  const cardCreated = card?.purchaseDate;
  const cardAge = cardCreated ? getCardAgeInDays(cardCreated) : 0;
  const insideReprintPeriod = cardAge < reprintPeriodInDays;

  const firstName = memberProfile?.firstName ?? '';
  const lastName = memberProfile?.lastName ?? '';

  return {
    isLoading,
    card,
    cardAge,
    insideReprintPeriod,
    firstName,
    lastName,
  };
};
export default useMemberCard;
