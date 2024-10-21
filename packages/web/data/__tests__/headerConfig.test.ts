import { AuthProviderFlags } from '@/root/src/common/auth/authUrls';
import { ZENDESK_V1_BLC_UK_URL } from '@/global-vars';
import { getNavItems } from '@/data/headerConfig';
import { NavItems } from '@/components/Header/types';

jest.mock('@/global-vars', () => ({
  AUTH0_LOGIN_URL: '/auth0/login',
  AUTH0_LOGOUT_URL: '/auth0/logout',
  COGNITO_LOGIN_URL: '/cognito/login',
  COGNITO_LOGOUT_URL: '/cognito/logout',
}));

describe('getNavItems', () => {
  const mockLogOffersClicked = jest.fn();
  const mockLogBrowseCategoriesClicked = jest.fn();
  const mockLogMyCardClicked = jest.fn();
  const mockLogMyAccountClicked = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when auth0 is Enabled', () => {
    test('should return correct items for logged in user', () => {
      const authProviderFlags: AuthProviderFlags = {
        isAuth0LoginLogoutWebEnabled: true,
        isCognitoUIEnabled: true,
      };

      const navItems = getNavItems(
        authProviderFlags,
        mockLogOffersClicked,
        mockLogBrowseCategoriesClicked,
        mockLogMyCardClicked,
        mockLogMyAccountClicked,
        false
      );

      thenLoggedInNavItemsContainsLogoutUrlOf(navItems, '/auth0/logout');
    });

    test('should return correct items for logged out user', () => {
      const authProviderFlags: AuthProviderFlags = {
        isAuth0LoginLogoutWebEnabled: true,
        isCognitoUIEnabled: true,
      };

      const navItems = getNavItems(
        authProviderFlags,
        mockLogOffersClicked,
        mockLogBrowseCategoriesClicked,
        mockLogMyCardClicked,
        mockLogMyAccountClicked,
        false
      );

      thenLoggedOutNavItemsContainsLoginUrlOf(navItems, '/auth0/login');
    });
  });

  describe('when Cognito is Enabled', () => {
    test('should return correct items for logged in user', () => {
      const authProviderFlags: AuthProviderFlags = {
        isAuth0LoginLogoutWebEnabled: false,
        isCognitoUIEnabled: true,
      };

      const navItems = getNavItems(
        authProviderFlags,
        mockLogOffersClicked,
        mockLogBrowseCategoriesClicked,
        mockLogMyCardClicked,
        mockLogMyAccountClicked,
        false
      );

      thenLoggedInNavItemsContainsLogoutUrlOf(navItems, '/cognito/logout');
    });

    test('should return correct items for logged out user', () => {
      const authProviderFlags: AuthProviderFlags = {
        isAuth0LoginLogoutWebEnabled: false,
        isCognitoUIEnabled: true,
      };

      const navItems = getNavItems(
        authProviderFlags,
        mockLogOffersClicked,
        mockLogBrowseCategoriesClicked,
        mockLogMyCardClicked,
        mockLogMyAccountClicked,
        false
      );

      thenLoggedOutNavItemsContainsLoginUrlOf(navItems, '/cognito/login');
    });
  });

  describe('when auth0 and cognito are both disabled', () => {
    test('should return correct items for logged in user', () => {
      const authProviderFlags: AuthProviderFlags = {
        isAuth0LoginLogoutWebEnabled: false,
        isCognitoUIEnabled: false,
      };

      const navItems = getNavItems(
        authProviderFlags,
        mockLogOffersClicked,
        mockLogBrowseCategoriesClicked,
        mockLogMyCardClicked,
        mockLogMyAccountClicked,
        false
      );

      thenLoggedInNavItemsContainsLogoutUrlOf(navItems, '/logout.php');
    });

    test('should return correct items for logged out user', () => {
      const authProviderFlags: AuthProviderFlags = {
        isAuth0LoginLogoutWebEnabled: false,
        isCognitoUIEnabled: false,
      };

      const navItems = getNavItems(
        authProviderFlags,
        mockLogOffersClicked,
        mockLogBrowseCategoriesClicked,
        mockLogMyCardClicked,
        mockLogMyAccountClicked,
        false
      );

      thenLoggedOutNavItemsContainsLoginUrlOf(navItems, '/login.php');
    });
  });

  describe('when Zendesk is Enabled', () => {
    test('should return Zendesk URL in list', () => {
      const authProviderFlags: AuthProviderFlags = {
        isAuth0LoginLogoutWebEnabled: true,
        isCognitoUIEnabled: true,
      };

      const navItemsWithZendesk = getNavItems(
        authProviderFlags,
        mockLogOffersClicked,
        mockLogBrowseCategoriesClicked,
        mockLogMyCardClicked,
        mockLogMyAccountClicked,
        true
      );

      expect(navItemsWithZendesk.loggedOut).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: 'FAQs',
            link: ZENDESK_V1_BLC_UK_URL,
          }),
        ])
      );
      expect(navItemsWithZendesk.loggedIn).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: 'FAQs',
            link: ZENDESK_V1_BLC_UK_URL,
          }),
        ])
      );
    });
  });

  describe('when Zendesk is disabled', () => {
    test('should not return Zendesk URL in list', () => {
      const authProviderFlags: AuthProviderFlags = {
        isAuth0LoginLogoutWebEnabled: true,
        isCognitoUIEnabled: true,
      };

      const navItemsWithoutZendesk = getNavItems(
        authProviderFlags,
        mockLogOffersClicked,
        mockLogBrowseCategoriesClicked,
        mockLogMyCardClicked,
        mockLogMyAccountClicked,
        false
      );

      expect(navItemsWithoutZendesk.loggedOut).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: 'FAQs',
            link: '/contactblc.php',
          }),
        ])
      );
      expect(navItemsWithoutZendesk.loggedIn).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: 'FAQs',
            link: '/support.php#questions',
          }),
        ])
      );
    });
  });

  function thenLoggedInNavItemsContainsLogoutUrlOf(navItems: NavItems, logoutUrl: string) {
    expect(navItems.loggedIn).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: 'Home',
          link: '/members-home',
        }),
        expect.objectContaining({ text: 'Offers' }),
        expect.objectContaining({
          text: 'My Card',
          link: '/highstreetcard.php',
        }),
        expect.objectContaining({
          text: 'Logout',
          link: logoutUrl,
        }),
      ])
    );
  }

  function thenLoggedOutNavItemsContainsLoginUrlOf(navItems: NavItems, loginUrl: string) {
    expect(navItems.loggedOut).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: 'Home',
          link: '/',
        }),
        expect.objectContaining({
          text: 'Black Friday',
          link: '/black-friday',
        }),
        expect.objectContaining({
          text: 'Login',
          link: loginUrl,
        }),
        expect.objectContaining({
          text: 'FAQs',
          link: '/contactblc.php',
        }),
      ])
    );
  }
});
