import { REQUEST_NEW_CARD_STEP } from './requestNewCardTypes';
import { ApplicationSchema, CardSchema } from '../CardVerificationAlerts/types';
import { completedPaymentStatuses } from './constants';

const {
  REASON,
  ADDRESS,
  ID_VERIFICATION_METHOD,
  ID_VERIFICATION_EMAIL,
  ID_VERIFICATION_UPLOAD,
  PAYMENT,
  DONE,
} = REQUEST_NEW_CARD_STEP;

export const sequenceInsideReprintPeriod = [REASON, ADDRESS, DONE];

export const sequenceEmailVerification = [
  REASON,
  ID_VERIFICATION_METHOD,
  ID_VERIFICATION_EMAIL,
  ADDRESS,
  PAYMENT,
  DONE,
];

export const sequenceIdUpload = [
  REASON,
  ID_VERIFICATION_METHOD,
  ID_VERIFICATION_UPLOAD,
  ADDRESS,
  PAYMENT,
  DONE,
];

export const sequenceIdUploadOnly = [ID_VERIFICATION_UPLOAD, DONE];

export const isStepComplete = (
  step: REQUEST_NEW_CARD_STEP,
  application: ApplicationSchema | null,
  isDoubleId = false,
  card: CardSchema | null,
  verificationMethod: string,
) => {
  if (!application) return false;
  const { postcode, applicationReason, trustedDomainValidated, documents = [] } = application;
  // const { postcode, applicationReason, reorderCardReason, trustedDomainValidated, documents = [] } = application;
  const nRequiredDocs = isDoubleId ? 2 : 1;
  const nDocs = documents.length;
  const paymentStatus = card?.paymentStatus;

  // TODO: this should change when the backend returns reorderCardReason on application GET
  // if (step === REASON) return !!reorderCardReason;
  if (step === REASON) return !!applicationReason;
  if (step === ADDRESS) return !!postcode;
  if (step === ID_VERIFICATION_METHOD) return !!verificationMethod;
  if (step === ID_VERIFICATION_EMAIL) return !!trustedDomainValidated;
  // if (step === ID_VERIFICATION_UPLOAD) return true;
  if (step === ID_VERIFICATION_UPLOAD) return nDocs >= nRequiredDocs;
  if (step === PAYMENT && paymentStatus) {
    return completedPaymentStatuses.includes(paymentStatus);
  }
  return false;
};
