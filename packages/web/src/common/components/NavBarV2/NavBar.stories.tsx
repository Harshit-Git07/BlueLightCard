import { Meta, StoryFn } from '@storybook/react';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';
import NavBarV2 from './NavBar';
import AuthenticatedNavBar from './components/organisms/AuthenticatedNavBar';
import UnauthenticatedNavBar from './components/organisms/UnauthenticatedNavBar';
import { getNavigationItems } from './helpers/getNavigationItems';
import { BRAND } from '@/root/global-vars';
import { BRANDS } from '../../types/brands.enum';

const CUSTOM_VIEWPORTS = {
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1400px',
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
  title: 'Organisms/NavBarV2',
  component: NavBarV2,
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

const HeaderTemplate: StoryFn = ({ isAuthenticated, isSticky, isZendeskV1BlcUkEnabled }) => {
  const navigationItems = getNavigationItems(
    BRAND as BRANDS,
    isAuthenticated,
    isZendeskV1BlcUkEnabled,
    { isAuth0LoginLogoutWebEnabled: false, isCognitoUIEnabled: false }
  );
  return (
    <div className="border">
      <header className="sticky top-0 z-10">
        {isAuthenticated ? (
          <AuthenticatedNavBar
            onSearchCategoryChange={() => {}}
            onSearchCompanyChange={() => {}}
            onSearchTerm={() => {}}
            isSticky={isSticky}
            navigationItems={navigationItems}
          />
        ) : (
          <UnauthenticatedNavBar navigationItems={navigationItems} isSticky={isSticky} />
        )}
        <div className="bg-colour-surface-container dark:bg-colour-surface-container-dark text-colour-onSurface dark:text-colour-onSurface-dark h-28 flex items-center justify-center">
          Some Content...
        </div>
      </header>
    </div>
  );
};

export const DeviceView = HeaderTemplate.bind({});
DeviceView.args = {
  isAuthenticated: true,
};

export const StickyHeaderView = HeaderTemplate.bind({});
StickyHeaderView.args = {
  isAuthenticated: true,
  isSticky: true,
};
