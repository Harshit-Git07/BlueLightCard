import { FC } from 'react';
import AwaitingId from './AwaitingId';
import AwaitingIdApproval from './AwaitingIdApproval';
import Rejected from './Rejected';
import {
  ApplicationReasonSchema,
  EligibilityStatusSchema,
  PaymentStatusSchema,
  RejectionReasonSchema,
  VerificationStatusSchema,
} from './types';
import useMemberApplication from '../../hooks/useMemberApplication';

const signUp: ApplicationReasonSchema = 'SIGNUP';
const renewal: ApplicationReasonSchema = 'RENEWAL';
const awaitingIdApproval: EligibilityStatusSchema = 'AWAITING_ID_APPROVAL';
const awaitingPayment: PaymentStatusSchema = 'AWAITING_PAYMENT';
const ineligible: EligibilityStatusSchema = 'INELIGIBLE';
const eligible: VerificationStatusSchema = 'ELIGIBLE';

const isSignUpOrRenewal = (applicationReason?: string) =>
  applicationReason === signUp || applicationReason === renewal;

const isAwaitingId = (
  applicationReason?: string,
  eligibilityStatus?: string,
  rejectionReason?: string,
) => isSignUpOrRenewal(applicationReason) && eligibilityStatus === ineligible && !rejectionReason;

const isAwaitingIdApproval = (
  applicationReason?: string,
  eligibilityStatus?: string,
  verificationMethod?: string,
) =>
  isSignUpOrRenewal(applicationReason) &&
  verificationMethod &&
  eligibilityStatus === awaitingIdApproval;

const isAwaitingPayment = (
  applicationReason?: string,
  paymentStatus?: string,
  eligibilityStatus?: string,
) =>
  isSignUpOrRenewal(applicationReason) &&
  eligibilityStatus === eligible &&
  paymentStatus === awaitingPayment;

const isRejected = (
  applicationReason?: string,
  eligibilityStatus?: string,
  rejectionReason?: string,
) => isSignUpOrRenewal(applicationReason) && eligibilityStatus === ineligible && rejectionReason;

const bannerTypeToAlert = (
  applicationReason?: ApplicationReasonSchema,
  eligibilityStatus?: string,
  verificationMethod?: string,
  rejectionReason?: RejectionReasonSchema,
  paymentStatus?: PaymentStatusSchema,
) => {
  if (isAwaitingId(applicationReason, eligibilityStatus, rejectionReason)) {
    return <AwaitingId key="isAwaitingId" paymentStatus={paymentStatus} />;
  }
  if (isAwaitingIdApproval(applicationReason, eligibilityStatus, verificationMethod)) {
    return <AwaitingIdApproval />;
  }
  if (isAwaitingPayment(applicationReason, paymentStatus, eligibilityStatus)) {
    return <AwaitingId key="isAwaitingPayment" paymentStatus={paymentStatus} />;
  }
  if (isRejected(applicationReason, eligibilityStatus, rejectionReason)) {
    return <Rejected reason={rejectionReason} />;
  }

  return null;
};

type Props = {
  memberUuid: string;
};

const CardVerificationBanner: FC<Props> = ({ memberUuid }) => {
  const { application } = useMemberApplication(memberUuid);

  if (!application) {
    return null;
  }

  const {
    applicationReason,
    eligibilityStatus,
    verificationMethod,
    rejectionReason,
    paymentStatus,
  } = application;
  return bannerTypeToAlert(
    applicationReason,
    eligibilityStatus,
    verificationMethod,
    rejectionReason,
    paymentStatus,
  );
};

export default CardVerificationBanner;
