import useMemberProfileGet from '../../hooks/useMemberProfileGet';
import { getCardAgeInDays } from '../../utils/cardUtils';
import { reprintPeriodInDays } from './requestNewCardConfig';

const useMemberCard = (memberId: string) => {
  const { isLoading, memberProfile } = useMemberProfileGet(memberId);
  const card = memberProfile?.card ?? null;
  const cardCreated = memberProfile?.card?.purchaseTime;
  const cardAge = cardCreated ? getCardAgeInDays(cardCreated) : 0;
  const insideReprintPeriod = cardAge < reprintPeriodInDays;
  const firstName = memberProfile?.firstName ?? '';
  const lastName = memberProfile?.lastName ?? '';
  return {
    isLoading,
    card,
    insideReprintPeriod,
    cardAge,
    firstName,
    lastName,
  };
};
export default useMemberCard;
