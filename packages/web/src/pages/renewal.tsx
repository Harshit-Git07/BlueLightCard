import { NextPage, Viewport } from 'next';
import { RenewalEligibilityFlow } from '@/root/src/member-eligibility/renewal/RenewalEligibilityFlow';
import AuthProvider from '@/context/Auth/AuthProvider';

const Renewal: NextPage = () => {
  return (
    <AuthProvider>
      <RenewalEligibilityFlow />
    </AuthProvider>
  );
};

export const viewport: Viewport = {
  colorScheme: 'only light', // We are disabling dark mode here as these "responsive" designs (unlike the "web / hybrid" designs) do not support dark mode yet
};

export default Renewal;
