import useAPIData from '@/hooks/useAPIData';
import { renderHook } from '@testing-library/react';
import useUserService from '@/hooks/useUserService';

jest.mock('@/hooks/useAPIData');

const useAPIDataMock = jest.mocked(useAPIData);

describe('use user service', () => {
  it('should return "service" value from API data result when "service" value present', () => {
    const serviceValue = 'NHS';
    useAPIDataMock.mockReturnValue({
      tid: 12345,
      service: serviceValue,
    });

    const result = renderHook(() => useUserService());

    expect(result.result.current).toEqual(serviceValue);
  });

  it('should return "undefined" value from API data result when no "service" value present', () => {
    const serviceValue = undefined;
    useAPIDataMock.mockReturnValue({});

    const result = renderHook(() => useUserService());

    expect(result.result.current).toEqual(undefined);
  });
});
