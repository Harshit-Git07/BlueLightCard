import { NextPage, Viewport } from 'next';
import { SignupEligibilityFlow } from '@/root/src/member-eligibility/sign-up/SignupEligibilityFlow';
import AuthProvider from '@/context/Auth/AuthProvider';

const Eligibility: NextPage = () => {
  return (
    <AuthProvider>
      <SignupEligibilityFlow />
    </AuthProvider>
  );
};

export const viewport: Viewport = {
  colorScheme: 'only light', // We are disabling dark mode here as these "responsive" designs (unlike the "web / hybrid" designs) do not support dark mode yet
};

export default Eligibility;
