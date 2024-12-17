import { NextPage } from 'next';
import { BRAND } from '@/globals';
import {
  ButtonV2 as Button,
  CardVerificationAlerts,
  CopyButton,
  fonts,
  getBrandStrapline,
  NoCardImage,
  ThemeVariant,
  useMemberCard,
  useMemberId,
  useMemberProfileGet,
  YourCard,
} from '@bluelightcard/shared-ui';
import { faCreditCardBlank } from '@fortawesome/pro-solid-svg-icons';
import useRouterReady from '@/hooks/useRouterReady';
import { SyntheticEvent } from 'react';

const MyCardPage: NextPage = () => {
  useRouterReady();

  const memberId = useMemberId();
  const { card } = useMemberCard(memberId);
  const { isFetching, memberProfile } = useMemberProfileGet(memberId);

  if (isFetching) {
    return null;
  }
  const strapline = getBrandStrapline(BRAND);

  const hasGenerated = !!card?.cardNumber;
  const hasNotGenerated = !hasGenerated && memberProfile?.applications.length;
  const hasNoCard = !hasGenerated && !hasNotGenerated;

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
              firstName={memberProfile?.firstName ?? ''}
              lastName={memberProfile?.lastName ?? ''}
              accountNumber={card?.cardNumber}
              expiryDate={card?.expiryDate}
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
                copyText={card?.cardNumber!}
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
