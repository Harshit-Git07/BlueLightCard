import type { Meta, StoryFn } from '@storybook/react';

import TabBar from './TabBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUserLarge } from '@fortawesome/pro-regular-svg-icons';
import { useState } from 'react';

const componentMeta: Meta<typeof TabBar> = {
  title: 'member-services-hub/TabBar',
  component: TabBar,
};

export default componentMeta;

const DefaultTemplate: StoryFn<typeof TabBar> = () => {
  const [open, setOpen] = useState('category1');
  function handleTabOpen(category: any) {
    setOpen(category);
  }
  return (
    <TabBar
      items={[
        {
          icon: <FontAwesomeIcon data-testid="profile-icon" icon={faUserLarge} />,
          category: 'category1',
          title: 'Tab 1',
          details:
            'Nulla facilisi cras fermentum odio eu feugiat. Varius duis at consectetur lorem donec massa sapien faucibus et. Nullam eget felis eget nunc lobortis mattis aliquam faucibus. Donec massa sapien faucibus et molestie ac feugiat sed lectus. Sagittis vitae et leo duis ut diam. Eu mi bibendum neque egestas congue quisque egestas diam.',
          open: open,
        },

        {
          icon: <FontAwesomeIcon data-testid="settings-icon" icon={faCog} />,
          category: 'category2',
          title: 'Tab 2',
          details:
            'Dolor sed viverra ipsum nunc aliquet bibendum enim. Felis imperdiet proin fermentum leo. Pulvinar elementum integer enim neque volutpat ac. Eu turpis egestas pretium aenean. Nisl rhoncus mattis rhoncus urna neque viverra justo nec ultrices. Nunc vel risus commodo viverra maecenas accumsan lacus. Ut sem viverra aliquet eget sit amet. Quis ipsum suspendisse ultrices gravida dictum fusce ut. Etiam sit amet nisl purus in mollis nunc sed id. Aliquet risus feugiat in ante.',
          open: 'category2',
        },
      ]}
      defaultOpen="category1"
      onTabClick={(category) => handleTabOpen(category)}
      selected={open}
    />
  );
};

export const Default = DefaultTemplate.bind({});

const AccountTemplate: StoryFn<typeof TabBar> = () => {
  const [open, setOpen] = useState('profile');
  function handleTabOpen(category: any) {
    setOpen(category);
  }
  return (
    <TabBar
      items={[
        {
          icon: <FontAwesomeIcon data-testid="profile-icon" icon={faUserLarge} />,
          category: 'profile',
          title: 'Profile',
          details: 'profile card page',
          open: 'profile',
        },
      ]}
      defaultOpen="profile"
      onTabClick={(category) => handleTabOpen(category)}
      selected={open}
    />
  );
};

export const Account = AccountTemplate.bind({});
