/* eslint-disable react/display-name */
import { as } from '@core/utils/testing';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useAmplitudeExperiment, useAmplitudeExperimentComponent } from '../hooks';
import { AuthedAmplitudeExperimentProvider } from '../provider';
import UserContext, { UserContextType } from '@/context/User/UserContext';
import _noop from 'lodash/noop';
import { Factory } from 'fishery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ExperimentClient } from '@amplitude/experiment-js-client';

const userContextTypeFactory = Factory.define<UserContextType>(() => ({
  dislikes: [],
  error: undefined,
  isAgeGated: false,
  setUser: _noop,
  user: {
    companies_follows: [],
    legacyId: 'mock-legacy-id',
    profile: {
      dob: 'mock-dob',
      organisation: 'mock-organisation',
    },
    uuid: 'mock-uuid',
  },
}));

const createWrapper =
  (userContext: UserContextType, initExperimentClient: () => Promise<ExperimentClient>) =>
  ({ children }: { children: ReactNode }) =>
    (
      <QueryClientProvider client={new QueryClient()}>
        <UserContext.Provider value={userContext}>
          <AuthedAmplitudeExperimentProvider initExperimentClient={initExperimentClient}>
            {children}
          </AuthedAmplitudeExperimentProvider>
        </UserContext.Provider>
      </QueryClientProvider>
    );

describe('useAmplitudeExperiment', () => {
  it('should return the treatment variant', async () => {
    // Arrange
    const userContext = userContextTypeFactory.build();
    const mockExperimentClient = {
      variant: jest.fn().mockReturnValue({ value: 'treatment' }),
    } satisfies Pick<ExperimentClient, 'variant'>;
    const wrapper = createWrapper(userContext, () => Promise.resolve(as(mockExperimentClient)));
    const experimentFlag = 'test-flag';
    const defaultVariant = 'control';

    // Act
    const { result } = renderHook(() => useAmplitudeExperiment(experimentFlag, defaultVariant), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Assert
    expect(result.current.data?.variantName).toBe('treatment');
  });

  it('should be return the default variant', async () => {
    // Arrange
    const userContext = userContextTypeFactory.build();
    const mockExperimentClient = {
      variant: jest.fn().mockReturnValue({ value: undefined }),
    } satisfies Pick<ExperimentClient, 'variant'>;
    const wrapper = createWrapper(userContext, () => Promise.resolve(as(mockExperimentClient)));
    const experimentFlag = 'test-flag';
    const defaultVariant = 'control';

    // Act
    const { result } = renderHook(() => useAmplitudeExperiment(experimentFlag, defaultVariant), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Assert
    expect(result.current.data?.variantName).toBe(defaultVariant);
  });

  it('should handle loading states', async () => {
    // Arrange
    const userContext = userContextTypeFactory.build();
    let resolver: (value: ExperimentClient) => void = _noop;
    const mockExperimentClient = {
      variant: jest.fn().mockReturnValue({ value: 'treatment' }),
    } satisfies Pick<ExperimentClient, 'variant'>;
    const wrapper = createWrapper(
      userContext,
      () => new Promise((resolve) => (resolver = resolve))
    );
    const experimentFlag = 'test-flag';
    const defaultVariant = 'control';

    // Act
    const { result } = renderHook(() => useAmplitudeExperiment(experimentFlag, defaultVariant), {
      wrapper,
    });

    // Assert
    expect(result.current.isLoading).toBe(true);

    // Act - wait until the next event loop cycle
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert
    expect(result.current.isLoading).toBe(true);

    // Act - resolve the promise
    resolver(as(mockExperimentClient));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Assert
    expect(result.current.data?.variantName).toBe('treatment');
  });
});

describe('useAmplitudeExperimentComponent', () => {
  it('should return the treatment component', async () => {
    // Arrange
    const userContext = userContextTypeFactory.build();
    const mockExperimentClient = {
      variant: jest.fn().mockReturnValue({ value: 'treatment' }),
    } satisfies Pick<ExperimentClient, 'variant'>;
    const wrapper = createWrapper(userContext, () => Promise.resolve(as(mockExperimentClient)));
    const experimentFlag = 'test-flag';
    const defaultVariant = 'control';
    const controlComponent = <h1 data-testid="control">control</h1>;
    const treatmentComponent = <h1 data-testid="treatment">treatment</h1>;

    // Act
    const { result } = renderHook(
      () =>
        useAmplitudeExperimentComponent(
          experimentFlag,
          {
            control: () => controlComponent,
            treatment: () => treatmentComponent,
          },
          defaultVariant
        ),
      {
        wrapper,
      }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Assert
    expect(result.current.data?.variantName).toEqual('treatment');
    expect(result.current.data?.component).toEqual(treatmentComponent);
  });

  it('should return the default variant component if variant value is undefined', async () => {
    // Arrange
    const userContext = userContextTypeFactory.build();
    const mockExperimentClient = {
      variant: jest.fn().mockReturnValue({ value: undefined }),
    } satisfies Pick<ExperimentClient, 'variant'>;
    const wrapper = createWrapper(userContext, () => Promise.resolve(as(mockExperimentClient)));
    const experimentFlag = 'test-flag';
    const defaultVariant = 'control';
    const controlComponent = <h1 data-testid="control">control</h1>;
    const treatmentComponent = <h1 data-testid="treatment">treatment</h1>;

    // Act
    const { result } = renderHook(
      () =>
        useAmplitudeExperimentComponent(
          experimentFlag,
          {
            control: () => controlComponent,
            treatment: () => treatmentComponent,
          },
          defaultVariant
        ),
      {
        wrapper,
      }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Assert
    expect(result.current.data?.variantName).toEqual('control');
    expect(result.current.data?.component).toEqual(controlComponent);
  });

  it('should return the default variant component if an unknown variant value is returned', async () => {
    // Arrange
    const userContext = userContextTypeFactory.build();
    const mockExperimentClient = {
      variant: jest.fn().mockReturnValue({ value: 'unknown' }),
    } satisfies Pick<ExperimentClient, 'variant'>;
    const wrapper = createWrapper(userContext, () => Promise.resolve(as(mockExperimentClient)));
    const experimentFlag = 'test-flag';
    const defaultVariant = 'control';
    const controlComponent = <h1 data-testid="control">control</h1>;
    const treatmentComponent = <h1 data-testid="treatment">treatment</h1>;

    // Act
    const { result } = renderHook(
      () =>
        useAmplitudeExperimentComponent(
          experimentFlag,
          {
            control: () => controlComponent,
            treatment: () => treatmentComponent,
          },
          defaultVariant
        ),
      {
        wrapper,
      }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Assert
    expect(result.current.data?.variantName).toEqual('control');
    expect(result.current.data?.component).toEqual(controlComponent);
  });
});
