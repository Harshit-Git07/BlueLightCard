import { Meta, StoryFn } from '@storybook/react';
import ChangeEmailAddress from './index';
import Drawer from '../Drawer/index';
import useDrawer from '../Drawer/useDrawer';
import { useEffect } from 'react';
import { PlatformAdapterProvider, storybookPlatformAdapter } from '../../adapters';
import { createQueryClient } from '../../utils/storyUtils';
import { QueryClientProvider } from '@tanstack/react-query';
import { jsonOrNull } from '../../utils/jsonUtils';
import Button from '../Button';
import { fonts } from '../../tailwind/theme';

const componentMeta: Meta<typeof ChangeEmailAddress> = {
  title: 'Organisms/Change Email Address',
  component: ChangeEmailAddress,
};

// Define the template which uses the component
const DefaultTemplate: StoryFn<typeof ChangeEmailAddress> = (args) => {
  const { email, memberUuid } = args;
  const { open } = useDrawer();
  const adapter = { ...storybookPlatformAdapter };
  adapter.invokeV5Api = async (url, options) => {
    await new Promise((accept) => setTimeout(accept, 1000));
    const payload = jsonOrNull<any>(options.body ?? '');
    if (payload?.email.startsWith('e')) {
      return Promise.resolve({
        status: 400,
        data: 'Something went wrong please try again.',
      });
    }

    return Promise.resolve({
      status: 200,
      data: 'ok',
    });
  };

  useEffect(() => {
    open(<ChangeEmailAddress email={email} memberUuid={memberUuid} />);
  }, [email, memberUuid]);

  return (
    <PlatformAdapterProvider adapter={adapter}>
      <QueryClientProvider client={createQueryClient()}>
        <div className={'min-h-[600px]'}>
          <Drawer />
          <Button
            onClick={() => open(<ChangeEmailAddress email={email} memberUuid={memberUuid} />)}
          >
            Change email
          </Button>
          <div className={`relative z-[1000] bg-colour-surface w-[200px] ${fonts.bodySmall} mt-4`}>
            <p>To simulate an API error enter an email starting with &apos;e&apos;</p>
          </div>
        </div>
      </QueryClientProvider>
    </PlatformAdapterProvider>
  );
};

export const Default = DefaultTemplate.bind({});

Default.args = {
  email: 'stuartcraigen@bluelightcard.co.uk',
  memberUuid: 'abcd-1234',
};

export default componentMeta;
