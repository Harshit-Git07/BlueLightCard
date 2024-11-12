import { PartialStoryFn } from '@storybook/types';
import { ReactRenderer, StoryContext } from '@storybook/react';
import { render, RenderResult, within } from '@testing-library/react';
import { StorybookSharedUIConfigDecorator } from './StorybookSharedUIConfigDecorator';
import { useSharedUIConfig } from './SharedUiConfigProvider';
import '@testing-library/jest-dom';

describe('StorybookSharedUIConfigDecorator', () => {
  let container: RenderResult['container'];

  const Story = () => {
    const config = useSharedUIConfig();

    return (
      <div>
        <p>Hello World!</p>
        <p>CDN URL: {config.globalConfig.cdnUrl}</p>
        <p>Brand: {config.globalConfig.brand}</p>
      </div>
    );
  };

  const storyContext = {
    parameters: { sharedUIConfig: { cdnUrl: 'test-cdn-url', brand: 'test-brand' } },
  };

  beforeEach(() => {
    const result = render(
      StorybookSharedUIConfigDecorator(
        Story as unknown as PartialStoryFn<ReactRenderer>,
        storyContext as unknown as StoryContext,
      ),
    );
    container = result.container;
  });

  it('renders the given story', () => {
    const text = within(container).getByText('Hello World!');
    expect(text).toBeInTheDocument();
  });

  it('adds given Shared UI Config overrides', () => {
    const cdnUrl = within(container).getByText('CDN URL: test-cdn-url');
    expect(cdnUrl).toBeInTheDocument();

    const brand = within(container).getByText('Brand: test-brand');
    expect(brand).toBeInTheDocument();
  });
});
