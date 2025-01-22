import { ApplicationSchema } from '../../../components/CardVerificationAlerts/types';
import { completedPaymentStatuses } from '../constants';

const hasAddress = (application: ApplicationSchema, county: string | undefined) => {
  const { country, city, address1 } = application;

  return !!country && !!city && !!address1 && !!county;
};

const renewalApplicationIsComplete = (
  application: ApplicationSchema,
  county: string | undefined,
) => {
  const { eligibilityStatus } = application;

  return eligibilityStatus === 'ELIGIBLE' && hasAddress(application, county);
};

const lostCardApplicationIsComplete = (
  application: ApplicationSchema,
  county: string | undefined,
) => {
  const { eligibilityStatus, paymentStatus } = application;

  if (!paymentStatus) return false;

  return (
    eligibilityStatus !== 'INELIGIBLE' &&
    completedPaymentStatuses.includes(paymentStatus) &&
    hasAddress(application, county)
  );
};

export const applicationIsComplete = (
  application: ApplicationSchema,
  county: string | undefined,
) => {
  const { applicationReason } = application;

  return applicationReason === 'RENEWAL'
    ? renewalApplicationIsComplete(application, county)
    : lostCardApplicationIsComplete(application, county);
};
