import { Meta, StoryFn } from '@storybook/react';
import Drawer from './index';
import useDrawer from './useDrawer';
import Button from '../Button/index';
import { SyntheticEvent } from 'react';

const componentMeta: Meta<typeof Drawer> = {
  title: 'Component System/Drawer',
  component: Drawer,
};

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export const DrawerExample: StoryFn<typeof Drawer> = () => {
  const { open, close } = useDrawer();
  const onClose = (e: SyntheticEvent) => {
    e.preventDefault();
    close();
  };

  const onOpenDrawer = (nLines: number) => (e: SyntheticEvent) => {
    e.preventDefault();
    const lotOfContent = Array(nLines)
      .fill('')
      .map((_, i) => ({ key: `lorem-${i}`, value: `${i + 1}. ${lorem}` }));

    const content = (
      <div className={'p-4'}>
        {lotOfContent.map(({ key, value }) => (
          <p key={key} className={'mb-4'}>
            {value}
          </p>
        ))}
        <Button onClick={onClose}>Close</Button>
      </div>
    );
    open(content);
  };

  return (
    <div className={'min-h-[600px]'}>
      <h1>Open a drawer with content</h1>
      <Button onClick={onOpenDrawer(1)}>Small</Button>{' '}
      <Button onClick={onOpenDrawer(2)}>Medium</Button>{' '}
      <Button onClick={onOpenDrawer(5)}>Large</Button>{' '}
      <Button onClick={onOpenDrawer(20)}>Xtra Large</Button>
      <Drawer />
    </div>
  );
};

export default componentMeta;
