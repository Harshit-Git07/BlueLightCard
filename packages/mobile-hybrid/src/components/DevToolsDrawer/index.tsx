import { FC } from 'react';
import { ButtonV2, Drawer, useDrawer } from '@bluelightcard/shared-ui';
import DevTools from './DevTools';

const DevToolsDrawer: FC = () => {
  const { open } = useDrawer();

  return (
    <div className={'fixed left-0 z-50 w-full bottom-0'}>
      <Drawer />

      <ButtonV2 className="float-right mr-2 mb-2" onClick={() => open(<DevTools />)}>
        Open Dev Tools
      </ButtonV2>
    </div>
  );
};

export default DevToolsDrawer;
