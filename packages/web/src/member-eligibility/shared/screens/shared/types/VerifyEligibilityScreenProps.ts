import { Dispatch } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export interface VerifyEligibilityScreenProps {
  eligibilityDetailsState: EligibilityDetailsState;
}

export type EligibilityDetailsState = [EligibilityDetails, Dispatch<EligibilityDetails>];
