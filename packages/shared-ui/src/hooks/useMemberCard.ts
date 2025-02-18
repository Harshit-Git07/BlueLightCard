import useMemberProfileGet from './useMemberProfileGet';
import { getCardAgeInDays } from '../utils/cardUtils';

export const reprintPeriodInDays = 90;

const useMemberCard = () => {
  const { isLoading, memberProfile } = useMemberProfileGet();
  const card = memberProfile?.cards?.at(-1) ?? null;

  const purchaseDate = card?.purchaseDate;
  const cardAge = purchaseDate ? getCardAgeInDays(purchaseDate) : 0;
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
