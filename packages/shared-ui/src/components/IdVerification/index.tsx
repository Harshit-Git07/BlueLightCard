import { FC, useEffect } from 'react';
import useIdVerification from './useIdVerification';
import IdVerificationMethods from './components/IdVerificationMethods/IdVerificationMethods';
import { IdVerificationMethod } from './IdVerificationTypes';
import IdVerificationEmail from './components/IdVerificationEmail/IdVerificationEmail';
import { initializeIdVerificationAtom } from './idVerificationAtom';
import IdVerificationUpload from './components/IdVerificationUpload/IdVerificationUpload';
import useMemberId from '@/hooks/useMemberId';

interface IdVerificationProps {
  isDoubleId?: boolean;
}

const IdVerificationIndex: FC<IdVerificationProps> = ({ isDoubleId = false }) => {
  const { selectedMethod, updateVerification } = useIdVerification();
  const memberId = useMemberId();

  useEffect(() => {
    updateVerification(initializeIdVerificationAtom(isDoubleId, memberId));
  }, [isDoubleId, memberId]);

  if (selectedMethod === IdVerificationMethod.WORK_EMAIL) {
    return <IdVerificationEmail />;
  }

  if (selectedMethod) {
    return <IdVerificationUpload />;
  }

  return <IdVerificationMethods />;
};

export default IdVerificationIndex;
