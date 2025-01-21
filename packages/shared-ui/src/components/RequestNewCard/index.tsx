import { FC } from 'react';
import RequestNewCardReason from './AddReason/index';
import useRequestNewCard from './useRequestNewCard';
import ChangeAddress from './ChangeAddress';
import IdVerificationMethods from './IdVerification/components/IdVerificationMethods/IdVerificationMethods';
import IdVerificationEmail from './IdVerification/components/IdVerificationEmail/IdVerificationEmail';
import IdVerificationUpload from './IdVerification/components/IdVerificationUpload/IdVerificationUpload';
import DoneScreen from './DoneScreen';
import MyCardPayment from './MyCardPayment/MyCardPayment';
import { REQUEST_NEW_CARD_STEP } from './requestNewCardTypes';

const {
  ADDRESS,
  ID_VERIFICATION_METHOD,
  ID_VERIFICATION_EMAIL,
  ID_VERIFICATION_UPLOAD,
  PAYMENT,
  DONE,
} = REQUEST_NEW_CARD_STEP;

const RequestNewCard: FC = () => {
  const { currentStepId } = useRequestNewCard();

  if (currentStepId === ADDRESS) return <ChangeAddress />;

  if (currentStepId === ID_VERIFICATION_METHOD) return <IdVerificationMethods />;

  if (currentStepId === ID_VERIFICATION_EMAIL) return <IdVerificationEmail />;

  if (currentStepId === ID_VERIFICATION_UPLOAD) return <IdVerificationUpload />;

  if (currentStepId === PAYMENT) return <MyCardPayment />;

  if (currentStepId === DONE) return <DoneScreen />;

  return <RequestNewCardReason />;
};

export default RequestNewCard;
