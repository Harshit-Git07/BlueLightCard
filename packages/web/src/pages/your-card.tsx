import React from 'react';
import { NextPage } from 'next';
import {
  ButtonV2 as Button,
  CopyButton,
  fonts,
  getBrandStrapline,
  NoCardImage,
  ThemeVariant,
  Typography,
  useGetCustomerProfile,
  YourCard,
} from '@bluelightcard/shared-ui';

import { faCreditCardBlank } from '@fortawesome/pro-solid-svg-icons';
import { BRAND } from '@/global-vars';
import withAccountLayout from '../common/layouts/AccountBaseLayout/withAccountLayout';

const MyCardPage: NextPage = () => {
  const memberUuid = 'member-uuid';

  const { isFetching, data: customerProfile } = useGetCustomerProfile(BRAND, memberUuid);
  if (isFetching) {
    return null;
  }
  const strapline = getBrandStrapline(BRAND);

  const hasGenerated = !!customerProfile?.card.cardNumber;
  const hasNotGenerated = !hasGenerated && customerProfile?.applications.length;
  const hasNoCard = !hasGenerated && !hasNotGenerated;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center tablet-xl:mt-5">
        <Typography variant="title-large">Your card</Typography>

        {hasGenerated ? (
          <Button
            className="hidden tablet-xl:block"
            variant={ThemeVariant.Tertiary}
            iconRight={faCreditCardBlank}
            type="button"
            size="Large"
            onClick={() => {}}
          >
            Request new card
          </Button>
        ) : null}
      </div>

      {!hasNoCard ? (
        <>
          <div className="flex justify-center mt-5 tablet-xl:mt-3">
            <YourCard
              brand={BRAND}
              firstName={customerProfile?.firstName ?? ''}
              lastName={customerProfile?.lastName ?? ''}
              accountNumber={customerProfile?.card.cardNumber}
              expiryDate={customerProfile?.card?.cardExpiry}
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
                    copyText={customerProfile?.card.cardNumber ?? ''}
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

export default withAccountLayout(MyCardPage, {});
