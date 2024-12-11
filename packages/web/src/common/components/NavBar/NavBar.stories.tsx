import { Meta, StoryFn } from '@storybook/react';
import { colours, StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';
import NavBar from '.';
import AuthenticatedNavBar from './components/organisms/AuthenticatedNavBar';
import UnauthenticatedNavBar from './components/organisms/UnauthenticatedNavBar';
import { getNavigationItems } from './helpers/getNavigationItems';
import { BRAND } from '@/root/global-vars';
import { BRANDS } from '../../types/brands.enum';

const CUSTOM_VIEWPORTS = {
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1200px',
      height: '1024px',
    },
  },
  laptop: {
    name: 'Laptop',
    styles: {
      width: '1024px',
      height: '1024px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  mobile: {
    name: 'Mobile',
    styles: {
      width: '375px',
      height: '667px',
    },
  },
};

const componentMeta: Meta = {
  title: 'Organisms/NavBar',
  component: NavBar,
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component:
          'This is the modernised version of the NavBar. Use the Device View Tab to be able to view the header in other device layouts.',
      },
    },
    controls: {
      exclude: ['onSearchCategoryChange', 'onSearchCompanyChange', 'onSearchTerm'],
    },
    viewport: {
      viewports: CUSTOM_VIEWPORTS,
      defaultViewport: 'desktop',
    },
  },
  decorators: [StorybookPlatformAdapterDecorator],
};

export default componentMeta;

const DefaultTemplate: StoryFn = ({ isAuthenticated, isSticky, isZendeskV1BlcUkEnabled }) => {
  const navigationItems = getNavigationItems(
    BRAND as BRANDS,
    isAuthenticated,
    isZendeskV1BlcUkEnabled,
    { isAuth0LoginLogoutWebEnabled: false, isCognitoUIEnabled: false }
  );
  return (
    <div>
      <header className="sticky top-0 z-10">
        {isAuthenticated ? (
          <AuthenticatedNavBar
            onSearchCategoryChange={() => {}}
            onSearchCompanyChange={() => {}}
            onSearchTerm={() => {}}
            isSticky={isSticky}
            navigationItems={navigationItems}
            onToggleMobileSideBar={() => alert('Open Account Menu')}
          />
        ) : (
          <UnauthenticatedNavBar />
        )}
        <div
          className={`h-28 flex items-center justify-center ${colours.backgroundSurfaceContainer} ${colours.textOnSurface} `}
        >
          Some Content...
        </div>
      </header>
    </div>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  isAuthenticated: true,
  isSticky: false,
};

export const Sticky = DefaultTemplate.bind({});
Sticky.args = {
  isAuthenticated: true,
  isSticky: true,
};
