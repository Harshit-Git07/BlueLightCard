import { ApplicationSchema } from '../../../components/CardVerificationAlerts/types';
import { applicationIsComplete } from './applicationIsComplete';

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
      applicationReason: 'LOST_CARD',
    };

    it('happy path works', () => {
      const completeApplication: ApplicationSchema = {
        ...lostCardApplication,
        ...defaultAddress,
        eligibilityStatus: 'ELIGIBLE',
        paymentStatus: 'PAID_CARD',
      };

      expect(applicationIsComplete(completeApplication, 'testCounty')).toBeTruthy();
    });

    it('sad path works as expected', () => {
      const completeApplication: ApplicationSchema = {
        ...lostCardApplication,
        ...defaultAddress,
        eligibilityStatus: 'INELIGIBLE',
        paymentStatus: 'AWAITING_PAYMENT',
      };

      expect(applicationIsComplete(completeApplication, 'testCounty')).toBeFalsy();
    });
  });

  describe('lost card flow', () => {
    const lostCardApplication: ApplicationSchema = {
      ...defaultApplication,
      applicationReason: 'RENEWAL',
    };

    it('happy path works', () => {
      const completeApplication: ApplicationSchema = {
        ...lostCardApplication,
        ...defaultAddress,
        eligibilityStatus: 'ELIGIBLE',
      };

      expect(applicationIsComplete(completeApplication, 'testCounty')).toBeTruthy();
    });

    it('sad path works as expected', () => {
      const completeApplication: ApplicationSchema = {
        ...lostCardApplication,
        ...defaultAddress,
        eligibilityStatus: 'ELIGIBLE',
      };

      expect(applicationIsComplete(completeApplication, undefined)).toBeFalsy();
    });
  });
});
