import { useCallback } from 'react';
import { isAusAddress } from '@/root/src/member-eligibility/shared/screens/shared/components/ManualAddressForm/hooks/utils/AddressType';
import { EligibilityDetailsAddress } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { deliveryAddressEvents } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/amplitude-events/DeliveryAddress';

export function useOnAddressSubmitted(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const currentAddress = eligibilityDetails.address;
  const logAnalyticsEvent = useLogAmplitudeEvent();
  return useCallback(() => {
    if (!currentAddress) return false;

    logAnalyticsEvent(deliveryAddressEvents.onFinishClicked(eligibilityDetails));
    const updatedAddress: EligibilityDetailsAddress = {
      line1: currentAddress.line1,
      ...(currentAddress.line2?.trim() && { line2: currentAddress.line2 }),
      city: currentAddress.city,
      postcode: currentAddress.postcode,
      ...(isAusAddress(currentAddress) ? { state: currentAddress.state } : {}),
    };

    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Payment Screen',
      address: updatedAddress,
    });
  }, [currentAddress, logAnalyticsEvent, eligibilityDetails, setEligibilityDetails]);
}
