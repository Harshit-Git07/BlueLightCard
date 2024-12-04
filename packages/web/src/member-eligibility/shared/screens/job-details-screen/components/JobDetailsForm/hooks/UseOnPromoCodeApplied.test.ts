import * as target from './UseOnPromoCodeApplied';
import { act, renderHook, RenderHookResult } from '@testing-library/react';

type Result = ReturnType<typeof target.useOnPromoCodeApplied>;
let result: RenderHookResult<Result, unknown>['result'];

describe('given the hook is rendered', () => {
  beforeEach(() => {
    const renderResult = renderHook(() => {
      return target.useOnPromoCodeApplied('promo-code-stub');
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

  describe('when a promocode is applied', () => {
    beforeEach(() => {
      act(() => {
        result.current.onPromoCodeApplied();
      });
    });

    // TODO: Test other flows here too
    it('should return success', () => {
      expect(result.current.promoCodeStatus).toBe('success');
    });

    describe('when the promocode is cleared', () => {
      beforeEach(() => {
        act(() => {
          result.current.onPromoCodeCleared();
        });
      });

      it('should return undefined', () => {
        expect(result.current.promoCodeStatus).toBe('default');
      });
    });
  });
});
