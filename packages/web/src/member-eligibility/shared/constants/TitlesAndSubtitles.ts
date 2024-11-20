import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

type Flow = EligibilityDetails['flow'];

export const employmentDetailsTitle = (flow: Flow): string => {
  return flow === 'Renewal' ? 'Review Employment Details' : 'Verify Eligibility';
};

export const employmentDetailsSubTitle = (flow: Flow): string => {
  return flow === 'Renewal'
    ? 'Please check your employment information and re-verify your status using a valid ID or email.'
    : 'Provide details about your employment status and job role';
};

export const verifyEligibilitySubTitle = (flow: Flow): string => {
  return flow === 'Renewal'
    ? 'Please check your employment information and re-verify your status using a valid ID or email.'
    : 'Verify your eligibility by providing a valid ID';
};
