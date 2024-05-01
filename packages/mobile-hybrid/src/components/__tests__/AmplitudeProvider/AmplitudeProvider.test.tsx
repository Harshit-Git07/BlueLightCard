import { render, renderHook, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AmplitudeProviderProps } from '@/components/AmplitudeProvider/types';
import AmplitudeProvider from '@/components/AmplitudeProvider/AmplitudeProvider';
import InvokeNativeExperiment from '@/invoke/experiment';
import { useAtom } from 'jotai';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import eventBus from '@/eventBus';
import { Channels } from '@/globals';

jest.mock('../../../invoke/experiment');

describe('Amplitude Provider component', () => {
  let props: AmplitudeProviderProps;

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Smoke test', () => {
    beforeEach(() => {
      props = {
        experimentKeys: [],
        featureFlagKeys: [],
      };
    });

    it('should render child component without error', () => {
      render(
        <AmplitudeProvider {...props}>
          <>Test Component</>
        </AmplitudeProvider>,
      );

      expect(screen.queryByText('Test Component')).toBeInTheDocument();
    });
  });

  describe('Experiments and Feature Flags atom', () => {
    beforeEach(() => {
      props = {
        experimentKeys: ['experiment-key'],
        featureFlagKeys: ['feature-flag-key'],
      };
    });

    it('should call for experiments', async () => {
      const experimentMock = jest
        .spyOn(InvokeNativeExperiment.prototype, 'experiment')
        .mockImplementation(() => jest.fn());

      whenAmplitudeProviderComponentIsRendered(props);

      expect(experimentMock).toHaveBeenCalledWith(['experiment-key', 'feature-flag-key']);
    });

    it('should set experiment and feature flag atom when experiments received from context', async () => {
      // Allows you to check current value of atoms
      const { result } = renderHook(() => useAtom(experimentsAndFeatureFlags));

      whenAmplitudeProviderComponentIsRendered(props);

      expect(result.current[0]).toStrictEqual({
        'experiment-key': 'control',
        'feature-flag-key': 'on',
      });
    });
  });
});

const whenAmplitudeProviderComponentIsRendered = (props: AmplitudeProviderProps) => {
  eventBus.emit(Channels.EXPERIMENTS, {
    'experiment-key': 'control',
    'feature-flag-key': 'on',
  });

  render(<AmplitudeProvider {...props}>Test Component</AmplitudeProvider>);
};
