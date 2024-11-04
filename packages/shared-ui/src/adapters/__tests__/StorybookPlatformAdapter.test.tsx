import { IPlatformAdapter } from '../PlatformAdapter';
import { PartialStoryFn } from '@storybook/types';
import { PlatformVariant } from '../../types';
import { ReactRenderer, StoryContext } from '@storybook/react';
import { render, RenderResult, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  storybookPlatformAdapter,
  StorybookPlatformAdapterDecorator,
} from '../StorybookPlatformAdapter';

describe('storybookPlatformAdapter', () => {
  it('returns an empty mocked platform adapter', async () => {
    expect(Object.keys(storybookPlatformAdapter)).toEqual([
      'getAmplitudeFeatureFlag',
      'invokeV5Api',
      'logAnalyticsEvent',
      'navigate',
      'navigateExternal',
      'writeTextToClipboard',
      'getBrandURL',
      'platform',
    ]);

    expect(storybookPlatformAdapter.getAmplitudeFeatureFlag('test-flag')).toEqual('control');
    expect(await storybookPlatformAdapter.invokeV5Api('/test-endpoint', { method: 'GET' })).toEqual(
      { status: 200, data: '{}' },
    );
    expect(storybookPlatformAdapter.logAnalyticsEvent('test_event', {})).toEqual(undefined);
    expect(storybookPlatformAdapter.navigate('/test-path')).toEqual(undefined);
    expect(storybookPlatformAdapter.navigateExternal('/test-path-2')).toEqual({
      isOpen: expect.any(Function),
    });
    expect(await storybookPlatformAdapter.writeTextToClipboard('test string')).toEqual(undefined);
    expect(storybookPlatformAdapter.getBrandURL()).toEqual('');
    expect(storybookPlatformAdapter.platform).toEqual(PlatformVariant.MobileHybrid);
  });
});

describe('StorybookPlatformAdapterDecorator', () => {
  let mockPlatformAdapter: IPlatformAdapter;
  let container: RenderResult['container'];

  type StoryProps = {
    platformAdapter: IPlatformAdapter;
  };

  const Story = (props: StoryProps) => {
    mockPlatformAdapter = props.platformAdapter;
    return <p>Hello World!</p>;
  };

  const storyContext = {
    parameters: { platformAdapter: { getAmplitudeFeatureFlag: () => 'treatment' } },
  };

  beforeEach(() => {
    const result = render(
      StorybookPlatformAdapterDecorator(
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

  it('adds given platform adapter overrides', () => {
    expect(mockPlatformAdapter).toBeDefined();
    expect(mockPlatformAdapter.getAmplitudeFeatureFlag('test-flag')).toEqual('treatment');
  });
});
