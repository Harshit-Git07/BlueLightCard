import { NextPage } from 'next';
import { BRAND } from '@/globals';
import {
  ButtonV2 as Button,
  CardVerificationAlerts,
  CopyButton,
  fonts,
  NoCardImage,
  ThemeVariant,
  YourCard,
} from '@bluelightcard/shared-ui';
import { faCreditCardBlank } from '@fortawesome/pro-solid-svg-icons';
import useRouterReady from '@/hooks/useRouterReady';
import { SyntheticEvent } from 'react';
import { getBrandStrapline } from '@bluelightcard/shared-ui/components/YourCard/text';
import useMemberId from '@bluelightcard/shared-ui/hooks/useMemberId';
import useMemberCard from '@bluelightcard/shared-ui/components/RequestNewCard/useMemberCard';
import useMemberApplication from '@bluelightcard/shared-ui/components/RequestNewCard/useMemberApplication';

const MyCardPage: NextPage = () => {
  const memberId = useMemberId();
  useRouterReady();

  const { isLoading, card, firstName, lastName } = useMemberCard(memberId);
  const { application } = useMemberApplication(memberId);

  const hasGenerated = !!card?.cardNumber;
  const hasNotGenerated = !hasGenerated && application;
  const hasNoCard = !hasGenerated && !hasNotGenerated;

  const strapline = getBrandStrapline(BRAND);

  if (isLoading) {
    return null;
  }

  const onRequestNewCard = (e: SyntheticEvent) => {
    e.preventDefault();
    // [TODO] implement later
  };

  const onGetYourCard = (e: SyntheticEvent) => {
    e.preventDefault();
    // [TODO] implement later
  };

  if (!hasNoCard) {
    return (
      <>
        <div className="relative flex justify-center h-[calc(100vh-113px)]">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <YourCard
              brand={BRAND}
              firstName={firstName}
              lastName={lastName}
              accountNumber={card?.cardNumber}
              expiryDate={card?.purchaseTime}
            />
          </div>
        </div>

        <CardVerificationAlerts memberUuid={memberId} />

        {hasGenerated ? (
          <div className={`absolute bottom-0 pb-[24px] flex flex-col items-center w-full`}>
            <div className="w-[327px] flex flex-col gap-2">
              <CopyButton
                variant={ThemeVariant.Primary}
                label="Copy card number"
                size="Large"
                copyText={card?.cardNumber}
                fullWidth={true}
              />

              <Button
                className="w-full"
                variant={ThemeVariant.Secondary}
                iconRight={faCreditCardBlank}
                type="button"
                size="Large"
                onClick={onRequestNewCard}
              >
                Request new card
              </Button>
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <div className="mt-[24px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <NoCardImage />
        </div>

        <div className="w-[327px] mt-[32px] flex flex-col items-center justify-center gap-[12px]">
          <p className={`mt-[24px] ${fonts.titleMediumSemiBold}`}>You don&apos;t have a card yet</p>

          <p className={`${fonts.body} text-center`}>{strapline}</p>
        </div>
      </div>

      <div className="absolute bottom-[24px] flex flex-col items-center w-full">
        <Button
          className="w-[327px]"
          variant={ThemeVariant.Primary}
          iconRight={faCreditCardBlank}
          type="button"
          size="Large"
          onClick={onGetYourCard}
        >
          Get your card
        </Button>
      </div>
    </>
  );
};

export default MyCardPage;
