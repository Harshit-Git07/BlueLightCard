import { useCallback, useState } from 'react';
import { PromoCodeVariant } from '@bluelightcard/shared-ui/components/PromoCode/types';

interface Result {
  promoCodeStatus: PromoCodeVariant | undefined;
  onPromoCodeApplied: () => void;
  onPromoCodeCleared: () => void;
}

export function useOnPromoCodeApplied(promoCode: string | undefined): Result {
  const [promoCodeStatus, setPromoCodeStatus] = useState<PromoCodeVariant>('default');

  const onPromoCodeApplied = useCallback(() => {
    // TODO: Will make a service layer call to verify the promocode
    console.log(`Applying promo code '${promoCode}'`);

    return setPromoCodeStatus('success');
  }, [promoCode]);

  const onPromoCodeCleared = useCallback(() => {
    setPromoCodeStatus('default');
  }, []);

  return {
    promoCodeStatus,
    onPromoCodeApplied,
    onPromoCodeCleared,
  };
}
