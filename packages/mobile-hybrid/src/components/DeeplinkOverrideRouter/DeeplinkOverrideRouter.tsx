import { FC, PropsWithChildren } from 'react';
import { PlatformVariant, useOfferDetails } from '@bluelightcard/shared-ui';
import InvokeNativeNavigation from '@/invoke/navigation';

const invokeNavigation = new InvokeNativeNavigation();
const navigate = invokeNavigation.navigate.bind(invokeNavigation);

/**
 * A custom router for overriding app deeplinks with hybrid behaviour.
 */
const DeeplinkOverrideRouter: FC<PropsWithChildren> = ({ children }) => {
  const { viewOffer } = useOfferDetails();

  const offerDetailsOverride = (url: string) => {
    const offerIdRegex = /oid=(\d+)/g;
    const offerId = offerIdRegex.exec(url)?.[1];

    const companyIdRegex = /cid=(\d+)/g;
    const companyId = companyIdRegex.exec(url)?.[1];

    viewOffer({
      offerId: Number(offerId),
      companyId: Number(companyId),
      companyName: '',
      platform: PlatformVariant.MobileHybrid,
    });
  };

  /**
   * Add a wrapper around the navigation prototype so we can use React Hooks in here
   */
  InvokeNativeNavigation.prototype.navigate = (url: string, allowOverride: boolean = false) => {
    // Fallback to just allowing native to do the navigation if anything goes wrong anywhere
    const fallback = () => navigate(url);
    if (!allowOverride) return fallback();

    try {
      const offerDetailsRegex = /offerdetails\.php\?[o|c]id=(\d+)&[o|c]id=(\d+)/;

      if (offerDetailsRegex.test(url)) {
        offerDetailsOverride(url);
        return;
      }

      return fallback();
    } catch (err) {
      console.error(
        'Error when performing deeplink overrides, falling back to native navigation',
        err,
      );
      return fallback();
    }
  };

  return <div>{children}</div>;
};

export default DeeplinkOverrideRouter;
