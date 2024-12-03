import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui/adapters';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { FC, PropsWithChildren, ReactNode } from 'react';

const MockedPlatformAdaptor: FC<PropsWithChildren> = ({ children }) => (
  <PlatformAdapterProvider adapter={useMockPlatformAdapter()}>{children}</PlatformAdapterProvider>
);

export function renderWithMockedPlatformAdapter(
  renderTarget: ReactNode,
  options?: Omit<RenderOptions, 'queries' | 'wrapper'>
): RenderResult {
  return render(<MockedPlatformAdaptor>{renderTarget}</MockedPlatformAdaptor>, options);
}
