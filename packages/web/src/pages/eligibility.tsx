import { NextPage, Viewport } from 'next';
import { SignupEligibilityFlow } from '@/root/src/member-eligibility/sign-up/SignupEligibilityFlow';

const Eligibility: NextPage = () => {
  return <SignupEligibilityFlow />;
};

export const viewport: Viewport = {
  colorScheme: 'only light', // We are disabling dark mode here as these "responsive" designs (unlike the "web / hybrid" designs) do not support dark mode yet
};

export default Eligibility;
