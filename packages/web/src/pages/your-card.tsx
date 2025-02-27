import React from 'react';
import { NextPage } from 'next';
import {
  ButtonV2 as Button,
  CopyButton,
  fonts,
  getBrandStrapline,
  NoCardImage,
  RequestNewCardButton,
  ThemeVariant,
  useMemberCard,
  useMemberProfileGet,
  usePlatformAdapter,
  YourCard,
  useGetOrganisation,
} from '@bluelightcard/shared-ui';

import { faCreditCardBlank } from '@fortawesome/pro-solid-svg-icons';
import { BRAND } from '@/global-vars';
import withAccountLayout from '@/layouts/AccountBaseLayout/withAccountLayout';

const YourCardPage: NextPage = () => {
  const adapter = usePlatformAdapter();
  const { isLoading, memberProfile } = useMemberProfileGet();
  const { card } = useMemberCard();

  //Prefetch orgs for faster sequence management
  useGetOrganisation(memberProfile?.organisationId);

  if (isLoading) {
    return null;
  }
  const strapline = getBrandStrapline(BRAND);

  const hasGenerated = !!card?.cardNumber;
  const hasNotGenerated = !hasGenerated && memberProfile?.applications?.length;
  const hasNoCard = !hasGenerated && !hasNotGenerated;

  return (
    <div className="flex flex-col gap-5">
      <div className="mt-[6px] flex justify-between items-center">
        <h2 className={fonts.titleLarge}>Your card</h2>

        {hasGenerated ? (
          <div className="hidden tablet-xl:block">
            <RequestNewCardButton isTertiary />
          </div>
        ) : null}
      </div>

      {!hasNoCard ? (
        <>
          <div className="flex justify-center mt-5 tablet-xl:mt-3">
            <YourCard
              brand={BRAND}
              firstName={memberProfile?.firstName ?? ''}
              lastName={memberProfile?.lastName ?? ''}
              accountNumber={card?.cardNumber}
              expiryDate={card?.expiryDate}
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
                  <RequestNewCardButton />
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
              onClick={() => adapter.navigate('/eligibility')}
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
