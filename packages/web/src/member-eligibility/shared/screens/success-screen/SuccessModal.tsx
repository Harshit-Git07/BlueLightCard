import { EligibilityModalTemplate } from '@/root/src/member-eligibility/shared/components/modal/EligibilityModalTemplate';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { AppDownloadLinks } from '@/root/src/member-eligibility/shared/components/modal/AppDownloadLinks';
import { useRouter } from 'next/router';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { getQrCodeForDownloadingApp } from '@/root/src/member-eligibility/shared/components/modal/helper';
import React, { FC } from 'react';

export const SuccessModal: FC = () => {
  const router = useRouter();
  const brandName = BRAND === BRANDS.DDS_UK ? 'Defence Discount Service' : 'Blue Light Card';
  const QrCode = getQrCodeForDownloadingApp();

  return (
    <EligibilityModalTemplate data-testid="sign-up-success-screen">
      <p
        className={`mx-[50px] mb-[24px] lg:mt-[78px] md:portrait:mt-[0px] ${fonts.displaySmallText} ${colours.textOnSurface} truncate`}
      >
        Sign Up Complete!
      </p>

      <Button
        className="mb-[60px] w-4/5"
        variant={ThemeVariant.Primary}
        size="Large"
        // TODO: We need to figure out if this screen routes us to members-home or should we already be there at this stage and this button just closes the modal?
        onClick={() => router.push('/members-home')}
      >
        Start saving
      </Button>

      <p
        className={`text-center leading-relaxed ${fonts.headlineSmallBold} ${colours.textOnSurface}`}
      >
        Get the {brandName} App
      </p>

      <p
        className={`mt-[8px] mb-[8px] text-center leading-relaxed ${fonts.body} ${colours.textOnSurface}`}
      >
        Easily search for stores or brands and get discounts on <br /> the go with your virtual
        card.
      </p>

      <QrCode className="h-full" />

      <AppDownloadLinks className="mt-[44px] mb-[78px] " />
    </EligibilityModalTemplate>
  );
};
