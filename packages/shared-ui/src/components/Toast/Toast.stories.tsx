import { Meta, StoryFn } from '@storybook/react';
import Toast from './index';
import Button from '../Button/index';
import { ThemeVariant } from '../../types';
import { ToastStatus } from './ToastTypes';
import { ChangeEvent, useState } from 'react';
import RadioButtonGroup from '../RadioButton/components/RadioButtonGroup/index';
import Typography from '../Typography';
import { faTrashCircle, faUserCircle, faCircleRadiation } from '@fortawesome/pro-solid-svg-icons';

const lorem =
  'Lorem ipsum dolor sit amet consectetur. Ut condimentum aliquet quis odio erat in nec.';

const icons = new Map();
icons.set('undefined', undefined);
icons.set('faTrashCircle', faTrashCircle);
icons.set('faUserCircle', faUserCircle);
icons.set('faCircleRadiation', faCircleRadiation);

const componentMeta: Meta<typeof Toast> = {
  title: 'Component System/Toast',
  component: Toast,
  argTypes: {
    title: {
      description: 'Optional title',
    },
    text: {
      description: 'The main message to be displayed - mandatory',
    },
    status: {
      description: 'Sets the icon and colours, can be omitted for a plain circle icon',
    },
    hasClose: {
      description: 'Should the close button be shown',
    },
    pauseOnHover: {
      description: 'Should the timeout pause when the mouse/pointer is over the toast message',
    },
    icon: {
      description: 'Any FontAwesome icon to override the default associated with the status',
      control: {
        type: 'radio',
      },
      options: Array.from(icons.keys()),
    },
    children: {
      description: 'Child elements to display inside the toast message - eg buttons',
      control: 'element',
    },
  },
};

export default componentMeta;

const DefaultTemplate: StoryFn<typeof Toast> = (args) => {
  const { icon: iconName } = args;
  const icon = icons.get(iconName);
  return <Toast {...args} icon={icon} />;
};

export const Default = DefaultTemplate.bind({});

Default.args = {
  title: 'This is a title',
  text: lorem,
  children: (
    <Button variant={ThemeVariant.Tertiary} slim>
      button
    </Button>
  ),
};

export const NoButtonChildren = DefaultTemplate.bind({});
NoButtonChildren.args = {
  text: 'This is a toast with no children (ie no buttons)',
};

export const WithAButton = DefaultTemplate.bind({});
WithAButton.args = {
  text: 'This is a toast with children (ie button)',
  children: <Button variant={ThemeVariant.Tertiary}>Button</Button>,
};

export const WithButtons = DefaultTemplate.bind({});
WithButtons.args = {
  text: 'This is a toast with children (ie button)',
  children: (
    <div>
      <Button variant={ThemeVariant.Tertiary}>Yes</Button>
      <Button variant={ThemeVariant.Tertiary}>No</Button>
    </div>
  ),
};

export const ToastStates: StoryFn<typeof Toast> = (args) => {
  const { text, title } = args;
  const [status, setStatus] = useState(ToastStatus.Default);

  const getStateSummaryRow = (
    label: string,
    hasTitle: boolean,
    hasButton: boolean,
    hasClose: boolean,
    txt: string,
  ) => {
    return (
      <tr>
        <td className={'py-10 '}>{label}</td>
        <td className={'py-10 '}>{getExample(hasTitle, hasButton, hasClose, txt)}</td>
      </tr>
    );
  };

  const getExample = (hasTitle: boolean, hasButton: boolean, hasClose: boolean, txt: string) => {
    return (
      <Toast title={hasTitle ? title : undefined} status={status} text={txt} hasClose={hasClose}>
        {hasButton ? <Button variant={ThemeVariant.Tertiary}>Button with icon</Button> : null}
      </Toast>
    );
  };

  const handleChangeState = (_: ChangeEvent<HTMLInputElement>, id?: string) =>
    setStatus(id as ToastStatus);

  return (
    <div>
      <Typography variant={'title-medium-semibold'}>Status options</Typography>
      <RadioButtonGroup
        name={'Status'}
        value={status}
        items={Object.values(ToastStatus).map((id) => ({ id }))}
        onChange={handleChangeState}
      />

      <table className={'w-[900px] my-4'}>
        <thead>
          <tr>
            <th>Examples</th>
            <th className={'w-[750px]'}>Desktop/large screen</th>
          </tr>
        </thead>
        <tbody>
          {getStateSummaryRow('Default', true, true, true, text)}
          {getStateSummaryRow('Hide title', false, true, true, text)}
          {getStateSummaryRow('Hide button', false, false, true, text)}
          {getStateSummaryRow('Hide close', false, false, false, text)}

          {getStateSummaryRow('Shorter', true, true, true, text.substring(0, 30))}
          {getStateSummaryRow('Shorter', false, false, false, text.substring(0, 30))}
        </tbody>
      </table>
    </div>
  );
};

ToastStates.args = {
  title: 'This is a title',
  text: lorem,
};

ToastStates.parameters = {
  controls: {
    exclude: /(hasClose|children)/g,
  },
};
