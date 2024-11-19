import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useRouter } from 'next/router';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import React, { FC } from 'react';
import { EligibilityModalBody } from '@/root/src/member-eligibility/shared/screens/shared/components/modal/EligibilityModalBody';
import { AppStoreQrCode } from '@/components/AppStoreQrCode/AppStoreQrCode';
import { AppStoreLinks } from '@/root/src/member-eligibility/shared/screens/shared/components/modal/AppStoreLinks';

export const SuccessModalDesktop: FC = () => {
  const router = useRouter();
  const brandName = BRAND === BRANDS.DDS_UK ? 'Defence Discount Service' : 'Blue Light Card';

  return (
    <EligibilityModalBody data-testid="sign-up-success-screen">
      <p
        className={`${fonts.displaySmallText} ${colours.textOnSurface} mx-[50px] mb-[24px] lg:mt-[78px] md:portrait:mt-[0px] truncate`}
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
        className={`${fonts.headlineSmallBold} ${colours.textOnSurface} text-center leading-relaxed`}
      >
        Get the {brandName} App
      </p>

      <p
        className={`${fonts.body} ${colours.textOnSurface} mt-[8px] mb-[8px] text-center leading-relaxed`}
      >
        Easily search for stores or brands and get discounts on <br /> the go with your virtual
        card.
      </p>

      <AppStoreQrCode className="h-full" />

      <AppStoreLinks className="mt-[44px] mb-[78px]" />
    </EligibilityModalBody>
  );
};
