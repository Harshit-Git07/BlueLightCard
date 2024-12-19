import { Decorator } from '@storybook/react';

const fontDecorator: Decorator = (Story) => {
  return (
    <main className="min-h-screen dark:bg-neutral-black">
      <Story />
    </main>
  );
};

export default fontDecorator;
