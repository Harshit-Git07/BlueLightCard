import '@testing-library/jest-dom';
import * as amplitude from '@amplitude/analytics-browser';
import { Amplitude } from '../amplitude';
import { amplitudeServiceAtom } from '../store';
import { amplitudeStore } from '../../../context/AmplitudeExperiment';
import { render, within } from '@testing-library/react';
import AmplitudeProvider from '../provider';

jest.mock('@amplitude/analytics-browser');
jest.mock('@/root/global-vars', () => ({
  ...jest.requireActual('@/root/global-vars'),
  AMPLITUDE_API_KEY: 'test-amplitude-api-key',
}));

describe('Amplitude provider', () => {
  it('initialises the amplitude service', () => {
    render(
      <AmplitudeProvider>
        <p>Hello World!</p>
      </AmplitudeProvider>
    );

    const amplitudeService = amplitudeStore.get(amplitudeServiceAtom);

    expect(amplitude.init).toHaveBeenCalled();
    expect(amplitudeService).toBeInstanceOf(Amplitude);
    expect(amplitudeService.isInitialised).toEqual(true);
  });

  it('renders the given children', () => {
    const { container } = render(
      <AmplitudeProvider>
        <p>Hello World!</p>
      </AmplitudeProvider>
    );

    const text = within(container).getByText('Hello World!');

    expect(text).toBeInTheDocument();
  });
});
