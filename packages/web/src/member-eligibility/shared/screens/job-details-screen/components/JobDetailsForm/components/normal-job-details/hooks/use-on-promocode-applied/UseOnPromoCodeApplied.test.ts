import * as target from './UseOnPromoCodeApplied';
import { act, renderHook, RenderHookResult, waitFor } from '@testing-library/react';
import { buildTestEligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/testing/BuildTestEligibilityDetails';
import { PromoCodeVariant } from '@bluelightcard/shared-ui/components/PromoCode/types';
import { useUpdateMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/UseUpdateMemberProfile';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

jest.mock(
  '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/UseUpdateMemberProfile'
);

const useUpdateMemberProfileMock = jest.mocked(useUpdateMemberProfile);

let eligibilityDetails: EligibilityDetails;
const setEligibilityDetailsMock = jest.fn();

type Result = ReturnType<typeof target.useOnPromoCodeApplied>;
let result: RenderHookResult<Result, unknown>['result'];

beforeEach(() => {
  eligibilityDetails = buildTestEligibilityDetails({
    organisation: {
      id: '1',
      label: 'Org 1',
      requiresJobTitle: true,
      requiresJobReference: false,
    },
  });
});

describe('given the hook is rendered with a org that allows skipping id', () => {
  beforeEach(() => {
    const updateMemberProfileMock = jest.fn();
    updateMemberProfileMock.mockImplementation(() => {
      eligibilityDetails.promoCode = 'PromoCode';
      eligibilityDetails.canSkipIdVerification = true;
    });
    useUpdateMemberProfileMock.mockReturnValue(updateMemberProfileMock);

    const renderResult = renderHook(() => {
      return target.useOnPromoCodeApplied([eligibilityDetails, setEligibilityDetailsMock]);
    });
    result = renderResult.result;
  });

  it('should return initial state', () => {
    expect(result.current).toEqual(<Result>{
      promoCodeStatus: 'default',
      onPromoCodeApplied: expect.any(Function),
      onPromoCodeCleared: expect.any(Function),
    });
  });

  describe('when a promocode is successfully applied', () => {
    beforeEach(() => {
      act(() => {
        result.current.onPromoCodeApplied('PromoCode');
      });
    });

    // TODO: Test other flows here too
    it('should return skip id success', () => {
      waitFor(() => {
        expect(result.current.promoCodeStatus).toBe(<PromoCodeVariant>'success-skip-id');
      });
    });

    describe('when the promocode is cleared', () => {
      beforeEach(() => {
        act(() => {
          result.current.onPromoCodeCleared();
        });
      });

      it('should return open', () => {
        expect(result.current.promoCodeStatus).toBe('open');
      });
    });
  });
});

describe('given the hook is rendered with a org that allows skipping id', () => {
  beforeEach(() => {
    const updateMemberProfileMock = jest.fn();
    updateMemberProfileMock.mockImplementation(() => {
      eligibilityDetails.promoCode = 'PromoCode';
      eligibilityDetails.canSkipPayment = true;
    });
    useUpdateMemberProfileMock.mockReturnValue(updateMemberProfileMock);

    const renderResult = renderHook(() => {
      return target.useOnPromoCodeApplied([eligibilityDetails, setEligibilityDetailsMock]);
    });
    result = renderResult.result;
  });

  it('should return initial state', () => {
    expect(result.current).toEqual(<Result>{
      promoCodeStatus: 'default',
      onPromoCodeApplied: expect.any(Function),
      onPromoCodeCleared: expect.any(Function),
    });
  });

  describe('when a promocode is successfully applied', () => {
    beforeEach(() => {
      act(() => {
        result.current.onPromoCodeApplied('PromoCode');
      });
    });

    // TODO: Test other flows here too
    it('should return skip id success', () => {
      waitFor(() => {
        expect(result.current.promoCodeStatus).toBe(<PromoCodeVariant>'success-skip-payment');
      });
    });

    describe('when the promocode is cleared', () => {
      beforeEach(() => {
        act(() => {
          result.current.onPromoCodeCleared();
        });
      });

      it('should return default open', () => {
        expect(result.current.promoCodeStatus).toBe('open');
      });
    });
  });
});
