import { Meta, StoryFn } from '@storybook/react';
import ChangePasswordForm from '.';
import { PlatformAdapterProvider, storybookPlatformAdapter } from '../../adapters';
import Drawer from '../Drawer';
import Toaster from '../Toast/Toaster';
import useDrawer from '../Drawer/useDrawer';
import useToaster from '../Toast/Toaster/useToaster';
import Toast from '../Toast';
import { ToastPosition, ToastStatus } from '../Toast/ToastTypes';
import { Button, ThemeVariant } from '../../index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UpdatePasswordPayload } from './types';
import { jsonOrNull } from '../../utils/jsonUtils';

const componentMeta: Meta<typeof ChangePasswordForm> = {
  title: 'Organisms/Change Password Form',
  component: ChangePasswordForm,
};

const errorUsedPassword = { errors: [{ code: '401', detail: '' }] };
const errorUnusual = { errors: [{ code: '400', detail: 'Unexpected error' }] };

const DefaultTemplate: StoryFn<typeof ChangePasswordForm> = (args) => {
  const { open } = useDrawer();
  const { openToast } = useToaster();

  const onPasswordUpdateSuccess = () => {
    openToast(<Toast text={'Success!'} status={ToastStatus.Success} />, {
      duration: 0,
      position: ToastPosition.TopRight,
    });
  };

  const handleButtonClick = () =>
    open(<ChangePasswordForm {...args} onPasswordUpdateSuccess={onPasswordUpdateSuccess} />);

  const adapter = {
    ...storybookPlatformAdapter,
  };
  adapter.invokeV5Api = async (_, options) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const formBody = jsonOrNull<UpdatePasswordPayload>(options.body!);

    if (formBody?.currentPassword.includes('0')) {
      return Promise.resolve({ status: 401, data: JSON.stringify(errorUsedPassword) });
    } else if (formBody?.currentPassword.includes('1')) {
      return Promise.resolve({ status: 400, data: JSON.stringify(errorUnusual) });
    } else {
      return Promise.resolve({ status: 200, data: '' });
    }
  };

  return (
    <PlatformAdapterProvider adapter={adapter}>
      <QueryClientProvider client={new QueryClient()}>
        <Toaster />
        <Drawer />
        <section className="flex flex-col items-center justify-center h-screen gap-4">
          <Button variant={ThemeVariant.Tertiary} onClick={handleButtonClick}>
            Change Password
          </Button>
          <div className="flex flex-col items-center">
            <p>If current password contains 0, you will get the `wrong current password` error.</p>
            <p>If current password contains 1, you will get a generic api error.</p>
          </div>
        </section>
      </QueryClientProvider>
    </PlatformAdapterProvider>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  memberId: 'tmpMemberId',
  onPasswordUpdateSuccess: () => undefined,
};

export default componentMeta;
