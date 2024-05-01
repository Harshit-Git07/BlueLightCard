import useAPI from '@/hooks/useAPI';
import { renderHook } from '@testing-library/react';
import useUserService from '@/hooks/useUserService';

jest.mock('@/hooks/useAPI');

const useAPIMock = jest.mocked(useAPI);

describe('use user service', () => {
  it('should return "service" value from API data result when "service" value present', () => {
    const serviceValue = 'NHS';
    useAPIMock.mockReturnValue({
      data: {
        tid: 12345,
        service: serviceValue,
      },
    });

    const result = renderHook(() => useUserService());

    expect(result.result.current).toEqual(serviceValue);
  });

  it('should return "undefined" value from API data result when no "service" value present', () => {
    useAPIMock.mockReturnValue({
      data: {},
    });

    const result = renderHook(() => useUserService());

    expect(result.result.current).toBeFalsy();
  });
});
