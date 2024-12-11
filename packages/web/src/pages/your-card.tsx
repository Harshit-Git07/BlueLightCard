import React from 'react';
import { NextPage } from 'next';
import {
  ButtonV2 as Button,
  CopyButton,
  NoCardImage,
  ThemeVariant,
  Typography,
  YourCard,
} from '@bluelightcard/shared-ui';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { faCreditCardBlank } from '@fortawesome/pro-solid-svg-icons';
import { BRAND } from '@/global-vars';
import withAccountLayout from '../common/layouts/AccountBaseLayout/withAccountLayout';
import { getBrandStrapline } from '@bluelightcard/shared-ui/components/YourCard/text';
import useMemberId from '@bluelightcard/shared-ui/hooks/useMemberId';
import RequestNewCardButton from '@bluelightcard/shared-ui/components/RequestNewCard/RequestNewCardButton';
import useMemberCard from '@bluelightcard/shared-ui/components/RequestNewCard/useMemberCard';
import useMemberApplication from '@bluelightcard/shared-ui/components/RequestNewCard/useMemberApplication';

const YourCardPage: NextPage = () => {
  const memberId = useMemberId();

  const { isLoading, card, firstName, lastName } = useMemberCard(memberId);
  const { application } = useMemberApplication(memberId);

  if (isLoading) {
    return null;
  }
  const strapline = getBrandStrapline(BRAND);

  const hasGenerated = !!card?.cardNumber;
  const hasNotGenerated = !hasGenerated && application;
  const hasNoCard = !hasGenerated && !hasNotGenerated;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center tablet-xl:mt-5">
        <Typography variant="title-large">Your card</Typography>
        {hasGenerated ? <RequestNewCardButton /> : null}
      </div>

      {!hasNoCard ? (
        <>
          <div className="flex justify-center mt-5 tablet-xl:mt-3">
            <YourCard
              brand={BRAND}
              firstName={firstName}
              lastName={lastName}
              accountNumber={card?.cardNumber}
              expiryDate={card?.purchaseTime}
            />
          </div>

          {hasGenerated ? (
            <div className="block tablet-xl:hidden mt-10">
              <div className="flex flex-col items-center justify-center">
                <div className="w-[327px] flex flex-col gap-2">
                  <CopyButton
                    variant={ThemeVariant.Primary}
                    label="Copy card number"
                    size="Large"
                    copyText={card?.cardNumber ?? ''}
                    fullWidth={true}
                  />

                  <Button
                    className="w-full"
                    variant={ThemeVariant.Secondary}
                    iconRight={faCreditCardBlank}
                    type="button"
                    size="Large"
                    onClick={() => {}}
                  >
                    Request new card
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-[24px] tablet-xl:mt-3 flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center">
            <NoCardImage />
          </div>

          <div className="mt-[32px] flex flex-col items-center justify-center gap-[12px]">
            <p className={`${fonts.titleMediumSemiBold}`}>You don&apos;t have a card yet</p>

            <p className={`${fonts.body} text-center`}>{strapline}</p>
          </div>

          <div className="flex flex-col items-center justify-center mt-[24px]">
            <Button
              className="tablet-xl:mt-0"
              variant={ThemeVariant.Primary}
              iconRight={faCreditCardBlank}
              type="button"
              size="Large"
              onClick={() => {}}
            >
              Get your card
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAccountLayout(YourCardPage, {});
