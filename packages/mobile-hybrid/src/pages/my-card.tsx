import { NextPage } from 'next';
import { Typography, ButtonV2 as Button, ThemeVariant, CopyButton } from '@bluelightcard/shared-ui';
import { faCreditCardBlank } from '@fortawesome/pro-solid-svg-icons';
import useRouterReady from '@/hooks/useRouterReady';

const MyCardPage: NextPage = () => {
  useRouterReady();

  const accountNumber = 'BLC0000000';

  return (
    <div
      className="h-screen flex flex-col overflow-y-hidden px-4 pt-4"
      style={{ height: 'calc(100vh - 20px)' }}
    >
      <Typography variant="title-medium">Your card</Typography>

      <div className="grow flex flex-col">
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

export default MyCardPage;
