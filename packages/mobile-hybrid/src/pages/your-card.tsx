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
  RequestNewCardButton,
} from '@bluelightcard/shared-ui';
import { faCreditCardBlank } from '@fortawesome/pro-solid-svg-icons';
import useRouterReady from '@/hooks/useRouterReady';
import AccountPagesHeader from '@/page-components/account/AccountPagesHeader';
import InvokeNativeNavigation from '@/invoke/navigation';
import { BRAND_WEB_URL } from '@/globals';

const MyCardPage: NextPage = () => {
  useRouterReady();

  const { isFetching, memberProfile } = useMemberProfileGet();
  const { card } = useMemberCard();

  const navigation = new InvokeNativeNavigation();

  if (isFetching) {
    return null;
  }
  const strapline = getBrandStrapline(BRAND);

  const hasGenerated = !!card?.cardNumber;
  const hasNotGenerated = !hasGenerated && memberProfile?.applications?.length;
  const hasNoCard = !hasGenerated && !hasNotGenerated;

  const eligibilityUrl = `https://${BRAND_WEB_URL}/eligibility`;

  return (
    <>
      <AccountPagesHeader title="Your Card" hasBackButton={false} />
      <CardVerificationAlerts />

      {!hasNoCard ? (
        <div className="flex flex-col w-full items-center overflow-hidden">
          <div className="relative flex flex-col justify-center h-[calc(100vh-125px)]">
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
          {hasGenerated ? (
            <div className={`absolute bottom-[24px] flex flex-col items-center w-full px-[16px]`}>
              <div className="flex flex-col max-w-[327px] w-full gap-2">
                <CopyButton
                  variant={ThemeVariant.Primary}
                  label="Copy card number"
                  size="Large"
                  copyText={card?.cardNumber!}
                  fullWidth={true}
                />
                <RequestNewCardButton />
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <div className="mt-[24px] flex flex-col items-center justify-center w-full px-[16px]">
            <div className="flex flex-col items-center justify-center w-full">
              <NoCardImage />
            </div>

            <div className="w-full max-w-[327px] mt-[32px] flex flex-col items-center justify-center gap-[12px]">
              <p className={`mt-[24px] text-center ${fonts.titleMediumSemiBold}`}>
                You don&apos;t have a card yet
              </p>

              <p className={`${fonts.body} text-center`}>{strapline}</p>
            </div>
          </div>

          <div className="absolute bottom-[24px] flex flex-col items-center w-full px-[16px]">
            <Button
              className="w-full max-w-[327px]"
              variant={ThemeVariant.Primary}
              iconRight={faCreditCardBlank}
              type="button"
              size="Large"
              onClick={() => {
                navigation.navigateExternal(eligibilityUrl);
              }}
            >
              Get your card
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default MyCardPage;
