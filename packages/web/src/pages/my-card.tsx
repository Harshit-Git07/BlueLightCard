import React from 'react';
import { NextPage } from 'next';
import withAccountLayout from '../common/layouts/AccountBaseLayout/withAccountLayout';
import { Typography, ButtonV2 as Button, ThemeVariant, CopyButton } from '@bluelightcard/shared-ui';
import { faCreditCardBlank } from '@fortawesome/pro-solid-svg-icons';

const MyCardPage: NextPage = () => {
  const accountNumber = 'BLC0000000';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <Typography variant="title-large">Your card</Typography>

        <Button
          className="mobile:hidden tablet:block"
          variant={ThemeVariant.Tertiary}
          iconRight={faCreditCardBlank}
          type="button"
          size="Small"
          onClick={() => {}}
        >
          Request new card
        </Button>
      </div>

      <div className="mobile:block tablet:hidden mt-10">
        <div className="flex flex-col items-center justify-center">
          <div className="w-[327px] flex flex-col gap-2">
            <CopyButton
              variant={ThemeVariant.Primary}
              label="Copy card number"
              copyText={accountNumber}
              fullWidth={true}
            />

            <Button
              className="w-full"
              variant={ThemeVariant.Secondary}
              iconRight={faCreditCardBlank}
              type="button"
              size="XSmall"
              onClick={() => {}}
            >
              Request new card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAccountLayout(MyCardPage, {});
