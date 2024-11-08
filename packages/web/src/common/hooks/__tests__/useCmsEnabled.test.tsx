import { renderHook } from '@testing-library/react';
import { useAmplitudeExperiment } from '../../context/AmplitudeExperiment';
import { useCmsEnabled } from '../useCmsEnabled';

jest.mock('../../context/AmplitudeExperiment');
const useAmplitudeExperimentMock = jest.mocked(useAmplitudeExperiment);

describe('useCmsEnabled', () => {
  it('should return true when the cms-offers variant is on', () => {
    useAmplitudeExperimentMock.mockReturnValue({
      data: {
        variantName: 'on',
      },
    } as unknown as ReturnType<typeof useAmplitudeExperiment>);

    const { result } = renderHook(() => useCmsEnabled());

    expect(result.current).toBe(true);
  });

  it('should return false when the cms-offers variant is off', () => {
    useAmplitudeExperimentMock.mockReturnValue({
      data: {
        variantName: 'off',
      },
    } as unknown as ReturnType<typeof useAmplitudeExperiment>);

    const { result } = renderHook(() => useCmsEnabled());

    expect(result.current).toBe(false);
  });

  it('should return false when there is no variant data', () => {
    useAmplitudeExperimentMock.mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useAmplitudeExperiment>);

    const { result } = renderHook(() => useCmsEnabled());

    expect(result.current).toBe(false);
  });
});
