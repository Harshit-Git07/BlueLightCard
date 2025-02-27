import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AmplitudeProps } from '@/components/Amplitude/types';
import Amplitude from '@/components/Amplitude/Amplitude';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';

describe('Amplitude component', () => {
  describe('Feature flag rendering value is set to `on`', () => {
    const amplitudeProps = {
      keyName: FeatureFlags.SEARCH_RECENT_SEARCHES,
      value: 'on',
    };

    describe('Feature Flag', () => {
      it('should render child component when feature flag is `on`', () => {
        whenComponentIsRenderedWith('on', amplitudeProps);

        expect(screen.queryByText('Test Component')).toBeInTheDocument();
      });

      it('should not render child component when feature flag is `off`', () => {
        whenComponentIsRenderedWith('off', amplitudeProps);

        expect(screen.queryByText('Test Component')).not.toBeInTheDocument();
      });
    });
  });

  describe('Feature flag rendering value is set to `off`', () => {
    const amplitudeProps = {
      keyName: FeatureFlags.SEARCH_RECENT_SEARCHES,
      value: 'off',
    };

    describe('Feature Flag', () => {
      it('should not render child component when feature flag is `on`', () => {
        whenComponentIsRenderedWith('on', amplitudeProps);

        expect(screen.queryByText('Test Component')).not.toBeInTheDocument();
      });

      it('should render child component when feature flag is `off`', () => {
        whenComponentIsRenderedWith('off', amplitudeProps);

        expect(screen.queryByText('Test Component')).toBeInTheDocument();
      });
    });
  });

  type FeatureFlagIntialValue = 'on' | 'off';

  function whenComponentIsRenderedWith(
    featureFlagInitialValue: FeatureFlagIntialValue,
    amplitudeProps: AmplitudeProps,
  ): void {
    render(
      <JotaiTestProvider
        initialValues={[
          [experimentsAndFeatureFlags, { [amplitudeProps.keyName]: featureFlagInitialValue }],
        ]}
      >
        <Amplitude {...amplitudeProps}>
          <>Test Component</>
        </Amplitude>
      </JotaiTestProvider>,
    );
  }
});
