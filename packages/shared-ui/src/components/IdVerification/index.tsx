import { FC, useEffect } from 'react';
import useIdVerification from './useIdVerification';
import IdVerificationMethods from './components/IdVerificationMethods/IdVerificationMethods';
import { IdVerificationMethod } from './IdVerificationTypes';
import IdVerificationEmail from './components/IdVerificationEmail/IdVerificationEmail';
import { initializeIdVerificationAtom } from './idVerificationAtom';
import IdVerificationUpload from './components/IdVerificationUpload/IdVerificationUpload';

interface IdVerificationProps {
  memberUuid: string;
  isDoubleId?: boolean;
}

const IdVerificationIndex: FC<IdVerificationProps> = ({ memberUuid, isDoubleId = false }) => {
  const { selectedMethod, updateVerification } = useIdVerification();

  useEffect(() => {
    updateVerification(initializeIdVerificationAtom(isDoubleId, memberUuid));
  }, [isDoubleId, memberUuid]);

  if (selectedMethod === IdVerificationMethod.WORK_EMAIL) {
    return <IdVerificationEmail />;
  }

  if (selectedMethod) {
    return <IdVerificationUpload />;
  }

  return <IdVerificationMethods />;
};

export default IdVerificationIndex;
