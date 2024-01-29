import { render, waitFor, act } from '@testing-library/react';
import useAmplitudeExperiment from '../useAmplitudeExperiment';
import React from 'react';

jest.mock('@amplitude/experiment-js-client', () => {
  return {
    Experiment: {
      initializeWithAmplitudeAnalytics: jest.fn(() => {
        return {
          start: jest.fn(),
          variant: jest.fn(() => {
            return { value: 'treatment' };
          }),
        };
      }),
    },
    ExperimentClient: {
      start: jest.fn(),
      variant: jest.fn(() => {
        return { value: 'treatment' };
      }),
    },
  };
});

const PageWithExperiment = (props: {
  hookData: [string, { variantName: string; component: any }[], string?, boolean?];
}) => {
  const { component, error } = useAmplitudeExperiment(...props.hookData);

  const componentToRender = component ? (
    component
  ) : error ? (
    <h1 data-testid="error">ERROR!</h1>
  ) : (
    <h1 data-testid="undefined">component</h1>
  );

  return componentToRender;
};

describe('useAmplitudeExperiment test', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be return the experimental component', async () => {
    const { getByTestId } = await act(async () => {
      return render(
        <PageWithExperiment
          hookData={[
            'test-deployment-key',
            [
              { variantName: 'control', component: <h1 data-testid="control">component</h1> },
              { variantName: 'treatment', component: <h1 data-testid="treatment">component</h1> },
            ],
            'control',
            true,
          ]}
        />
      );
    });

    await waitFor(
      () => {
        expect(getByTestId('treatment')).toBeDefined();
      },
      { timeout: 500 }
    );

    expect(getByTestId('treatment')).toBeDefined();
  });

  it('should show the fallback component as the experiment component was not provided', async () => {
    const { getByTestId } = await act(async () => {
      return render(
        <PageWithExperiment
          hookData={[
            'test-deployment-key',
            [
              { variantName: 'control', component: <h1 data-testid="control">component</h1> },
              // { variantName: 'treatment', component: <h1 data-testid="treatment">component</h1> },
            ],
            'control',
            true,
          ]}
        />
      );
    });

    await waitFor(
      () => {
        expect(getByTestId('control')).toBeDefined();
      },
      { timeout: 500 }
    );

    expect(getByTestId('control')).toBeDefined();
  });

  it('An error should be thrown when no variant options are provided', async () => {
    const { getByTestId } = await act(async () => {
      return render(<PageWithExperiment hookData={['test-deployment-key', [], 'control', true]} />);
    });

    await waitFor(
      () => {
        expect(getByTestId('error')).toBeDefined();
      },
      { timeout: 500 }
    );

    expect(getByTestId('error')).toBeDefined();
  });
});
