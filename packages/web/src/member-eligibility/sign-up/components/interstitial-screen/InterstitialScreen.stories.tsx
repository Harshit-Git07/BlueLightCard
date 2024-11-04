import { Meta, StoryFn } from '@storybook/react';
import InterstitialScreen from './InterstitialScreen';

const meta: Meta<typeof InterstitialScreen> = {
  title: 'MER Screens/Interstitial Screen',
  component: InterstitialScreen,
};

const InterstitialScreenTemplate: StoryFn<typeof InterstitialScreen> = () => <InterstitialScreen />;
export const Default = InterstitialScreenTemplate.bind({});
Default.args = {};

export default meta;
