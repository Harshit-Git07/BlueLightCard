import { ApplicationSchema } from '../../../components/CardVerificationAlerts/types';
import { applicationIsComplete } from './applicationIsComplete';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';

const defaultApplication = {
  memberId: 'testMemberId',
  applicationId: 'testApplicationId',
};

const defaultAddress = {
  address1: 'testAddress1',
  address2: 'testAddress2',
  city: 'testCity',
  country: 'testCountry',
};

describe('applicationIsComplete util', () => {
  describe('lost card flow', () => {
    const lostCardApplication: ApplicationSchema = {
      ...defaultApplication,
      applicationReason: ApplicationReason.LOST_CARD,
    };

    it('happy path works', () => {
      const completeApplication: ApplicationSchema = {
        ...lostCardApplication,
        ...defaultAddress,
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
        paymentStatus: PaymentStatus.PAID_CARD,
      };

      expect(applicationIsComplete(completeApplication, 'testCounty')).toBeTruthy();
    });

    it('sad path works as expected', () => {
      const completeApplication: ApplicationSchema = {
        ...lostCardApplication,
        ...defaultAddress,
        eligibilityStatus: EligibilityStatus.INELIGIBLE,
        paymentStatus: PaymentStatus.AWAITING_PAYMENT,
      };

      expect(applicationIsComplete(completeApplication, 'testCounty')).toBeFalsy();
    });
  });

  describe('lost card flow', () => {
    const lostCardApplication: ApplicationSchema = {
      ...defaultApplication,
      applicationReason: ApplicationReason.REPRINT,
    };

    it('happy path works', () => {
      const completeApplication: ApplicationSchema = {
        ...lostCardApplication,
        ...defaultAddress,
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
      };

      expect(applicationIsComplete(completeApplication, 'testCounty')).toBeTruthy();
    });

    it('sad path works as expected', () => {
      const completeApplication: ApplicationSchema = {
        ...lostCardApplication,
        ...defaultAddress,
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
      };

      expect(applicationIsComplete(completeApplication, undefined)).toBeFalsy();
    });
  });
});
