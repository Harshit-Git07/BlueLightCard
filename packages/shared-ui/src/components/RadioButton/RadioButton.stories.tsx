import { Meta, StoryFn } from '@storybook/react';
import RadioButton from './index';
import { ChangeEvent, useState } from 'react';
import RadioButtonInput from './components/RadioButtonInput/index';

const ascii = `
  ,-.
  )"(
 /.U.\\
; ::; ;
( ::; )
 \`.'.'
`;

// Meta data of the component to build the story
const componentMeta: Meta<typeof RadioButton> = {
  title: 'Component System/RadioButton/RadioButton',
  component: RadioButton,
  // decorators: [
  //   (Story) => (
  //     <div className={'p-2 bg-colour-surface dark:bg-colour-surface-dark'}>
  //       <Story />
  //     </div>
  //   ),
  // ],
  parameters: {
    status: 'wip',
  },
};

// Define the template which uses the component
const DefaultTemplate: StoryFn<typeof RadioButton> = (args) => <RadioButton {...args} />;

export const Default = DefaultTemplate.bind({});
Default.args = {
  id: 'Solo',
  children: 'Radio button label',
  disabled: false,
  withBorder: false,
  checked: false,
};

export const ComplexChildren = DefaultTemplate.bind({});
ComplexChildren.args = {
  id: 'complex',
  children: (
    <span>
      <em>One</em> lonely radio button by itself makes no sense{' '}
      <span className={'bg-colour-primary text-colour-onPrimary'}>at all</span>
    </span>
  ),
  disabled: false,
  withBorder: false,
};

export const WorkingExample: StoryFn<typeof RadioButton> = (args) => {
  const { withBorder, disabled } = args;
  const [selectedId, setSelectedId] = useState('');
  const ids = ['Batman', 'Penguin', 'Joker', 'Robin'];
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>, id: string = '') => {
    setSelectedId(id);
  };

  return (
    <div>
      <h2>Who is your favourite character?</h2>
      <div className={'py-4'}>
        {ids.map((id) => (
          <RadioButton
            key={id}
            id={id}
            name={'batman-characters'}
            checked={selectedId === id}
            onChange={onChangeHandler}
            withBorder={withBorder}
            disabled={disabled}
          >
            {id}
          </RadioButton>
        ))}
      </div>
      <p>value: {selectedId}</p>
    </div>
  );
};

WorkingExample.args = {
  disabled: false,
  withBorder: false,
};

WorkingExample.argTypes = {
  disabled: { type: 'boolean' },
  withBorder: { type: 'boolean' },
  id: { control: { disable: true } },
  name: { control: { disable: true } },
};

WorkingExample.parameters = {
  controls: {
    exclude: ['id', 'name', 'onChange', 'checked'],
  },
};

export const DisabledState = DefaultTemplate.bind({});
DisabledState.args = {
  ...Default.args,
  children: 'Disabled',
  disabled: true,
};

export const DisabledSelectedState = DefaultTemplate.bind({});
DisabledSelectedState.args = {
  ...Default.args,
  children: 'Disabled and checked',
  disabled: true,
  checked: true,
};

export const SelectedState = DefaultTemplate.bind({});
SelectedState.args = {
  ...Default.args,
  children: 'Checked',
  checked: true,
};

export const WithBorder = DefaultTemplate.bind({});
WithBorder.args = {
  ...Default.args,
  children: 'With border',
  withBorder: true,
};

export const AllStatesAndVariants: StoryFn<typeof RadioButton> = (args) => {
  return (
    <table cellPadding={20} className={'text-colour-onSurface dark:text-colour-onSurface-dark'}>
      <tr>
        <th></th>
        <th>Disabled</th>
        <th>Unselected</th>
        <th>Selected</th>
      </tr>
      <tr>
        <th rowSpan={2}>Default</th>
        <td>No</td>
        <td>
          <RadioButton id={'defaultUnselected'}>Radio Button text</RadioButton>
        </td>
        <td>
          <RadioButton id={'defaultSelected'} checked>
            Radio Button text
          </RadioButton>
        </td>
      </tr>
      <tr>
        <td>Yes</td>
        <td>
          <RadioButton id={'defaultUnselected'} disabled>
            Radio Button text
          </RadioButton>
        </td>
        <td>
          <RadioButton id={'defaultSelected'} disabled checked>
            Radio Button text
          </RadioButton>
        </td>
      </tr>
      <tr>
        <th rowSpan={2}>withBorder</th>
        <td>No</td>
        <td>
          <RadioButton id={'defaultUnselected'} withBorder>
            Radio Button text
          </RadioButton>
        </td>
        <td>
          <RadioButton id={'defaultSelected'} checked withBorder>
            Radio Button text
          </RadioButton>
        </td>
      </tr>
      <tr>
        <td>Yes</td>
        <td>
          <RadioButton id={'defaultUnselected'} disabled withBorder>
            Radio Button text
          </RadioButton>
        </td>
        <td>
          <RadioButton id={'defaultSelected'} disabled checked withBorder>
            Radio Button text
          </RadioButton>
        </td>
      </tr>
    </table>
  );
};

export const CompositionExample: StoryFn<typeof RadioButton> = (args) => {
  const [selectedId, setSelectedId] = useState('batman');
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>, id = '') => {
    setSelectedId(id);
  };
  return (
    <fieldset>
      <div>
        <h2 className={'text-colour-onSurface dark:text-colour-onSurface-dark'}>Heroes</h2>
        <RadioButton
          id={'batman'}
          name={'dc-chars'}
          checked={selectedId === 'batman'}
          onChange={onChangeHandler}
        >
          Batman
        </RadioButton>
        <RadioButton
          id={'robin'}
          name={'dc-chars'}
          checked={selectedId === 'robin'}
          onChange={onChangeHandler}
        >
          Robin (not a very good sidekick character)
        </RadioButton>

        <h2 className={'pt-4 text-colour-onSurface dark:text-colour-onSurface-dark'}>Villains</h2>
        <RadioButton
          id={'joker'}
          name={'dc-chars'}
          checked={selectedId === 'joker'}
          onChange={onChangeHandler}
        >
          Joker
        </RadioButton>
        <RadioButton
          id={'riddler'}
          name={'dc-chars'}
          checked={selectedId === 'riddler'}
          onChange={onChangeHandler}
        >
          Riddler
        </RadioButton>
        <div
          className={
            'bg-colour-warning dark:bg-colour-warning-dark text-colour-onPrimary dark:text-colour-onPrimary-dark'
          }
        >
          <label htmlFor={'penguin'}>
            <pre>{ascii}</pre>
            Penguin
          </label>
          <br />
          <RadioButtonInput
            id={'penguin'}
            name={'dc-chars'}
            checked={selectedId === 'penguin'}
            onChange={onChangeHandler}
          />
        </div>
      </div>
    </fieldset>
  );
};

export default componentMeta;
