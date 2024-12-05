import { useCallback } from 'react';
import { EligibilityDetailsAddress } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { deliveryAddressEvents } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/amplitude-events/DeliveryAddress';
import { useUpdateMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/UseUpdateMemberProfile';
import { regionSpecificAddressOptions } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/utils/RegionSpecificAddressOptions';

export function useOnAddressSubmitted(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const currentAddress = eligibilityDetails.address;

  const logAnalyticsEvent = useLogAmplitudeEvent();
  const updateMemberProfile = useUpdateMemberProfile(eligibilityDetailsState);

  return useCallback(() => {
    if (!currentAddress) return false;

    logAnalyticsEvent(deliveryAddressEvents.onFinishClicked(eligibilityDetails));
    const updatedAddress: EligibilityDetailsAddress = {
      line1: currentAddress.line1,
      ...(currentAddress.line2?.trim() && { line2: currentAddress.line2 }),
      city: currentAddress.city,
      postcode: currentAddress.postcode,
      ...regionSpecificAddressOptions(currentAddress),
    };

    updateMemberProfile().then(() => {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Payment Screen',
        address: updatedAddress,
      });
    });
  }, [
    currentAddress,
    logAnalyticsEvent,
    eligibilityDetails,
    updateMemberProfile,
    setEligibilityDetails,
  ]);
}
