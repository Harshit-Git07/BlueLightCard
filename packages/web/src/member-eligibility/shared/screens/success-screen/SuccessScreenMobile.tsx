import React, { FC } from 'react';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { AppDownloadLinks } from '@/root/src/member-eligibility/shared/components/modal/AppDownloadLinks';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useRouter } from 'next/router';
import DefaultImage from '@assets/modalPlaceholder.svg';

export const SuccessScreenMobileView: FC = () => {
  const router = useRouter();

  return (
    <EligibilityScreen data-testid="success-screen-mobile">
      <div className="mx-[18px]">
        <p
          className={`mt-[32px] text-center leading-relaxed ${fonts.headlineBold} ${colours.textOnSurface}`}
        >
          Sign Up Complete! <br /> Get the App
        </p>

        <p
          className={`mt-[4px] text-center leading-relaxed ${fonts.body} ${colours.textOnSurface}`}
        >
          Easily search for stores or brands and get discounts on the go with your virtual card.
        </p>

        <div>
          <AppDownloadLinks className="mt-[24px]" />
        </div>

        <Button
          className="mt-[24px] mb-[24px] w-full"
          variant={ThemeVariant.Primary}
          size="Large"
          // TODO: We need to figure out if this screen routes us to members-home or should we already be there at this stage and this button just closes the modal?
          onClick={() => router.push('/members-home')}
        >
          Start saving
        </Button>

        <DefaultImage className="w-full h-full mb-[24px]" />
      </div>
    </EligibilityScreen>
  );
};
