import { fireEvent, render, screen } from '@testing-library/react';
import AccountDrawer from './';
import '@testing-library/jest-dom';

describe('AccountDrawer', () => {
  const title = 'Account Settings';
  const primaryButtonLabel = 'Save';
  const secondaryButtonLabel = 'Cancel';
  const primaryButtonOnClick = jest.fn();
  const secondaryButtonOnClick = jest.fn();
  const childText = 'Additional account information';

  const renderAccountDrawer = (disabled = false, customTitle = title) =>
    render(
      <AccountDrawer
        title={customTitle}
        primaryButtonLabel={primaryButtonLabel}
        primaryButtonOnClick={primaryButtonOnClick}
        secondaryButtonLabel={secondaryButtonLabel}
        secondaryButtonOnClick={secondaryButtonOnClick}
        isDisabled={disabled}
      >
        <p>{childText}</p>
      </AccountDrawer>,
    );

  describe('renders account drawer', () => {
    const setup = (disabled = false, customTitle = title) => {
      renderAccountDrawer(disabled, customTitle);
      const drawerContainer = screen.getByTestId('accountDrawer');
      const primaryBtnContainer = drawerContainer.querySelector(
        '[data-testid="primary-btn-container"]',
      ) as HTMLElement;
      const primaryButton = primaryBtnContainer?.querySelector('button') as HTMLElement;

      const secondaryBtnContainer = drawerContainer.querySelector(
        '[data-testid="secondary-btn-container"]',
      ) as HTMLElement;
      const secondaryButton = secondaryBtnContainer?.querySelector('button') as HTMLElement;

      return { drawerContainer, primaryButton, secondaryButton };
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders title', () => {
      const { drawerContainer } = setup();
      expect(drawerContainer).toHaveTextContent(title);
    });

    it('does not render title when not provided', () => {
      const { drawerContainer } = setup(false, '');
      expect(drawerContainer).not.toHaveTextContent(title);
    });

    it('renders primary button with the correct label', () => {
      const { primaryButton } = setup();
      expect(primaryButton).toBeInTheDocument();
      expect(primaryButton).toHaveTextContent(primaryButtonLabel);
    });

    it('renders secondary button with the correct label', () => {
      const { secondaryButton } = setup();
      expect(secondaryButton).toBeInTheDocument();
      expect(secondaryButton).toHaveTextContent(secondaryButtonLabel);
    });

    it('calls primary button onClick when clicked', () => {
      const { primaryButton } = setup();
      fireEvent.click(primaryButton);
      expect(primaryButtonOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls secondary button onClick when clicked', () => {
      const { secondaryButton } = setup();
      fireEvent.click(secondaryButton);
      expect(secondaryButtonOnClick).toHaveBeenCalledTimes(1);
    });

    it('renders children when provided', () => {
      const { drawerContainer } = setup();
      expect(drawerContainer).toHaveTextContent(childText);
    });

    it('primary button should be enabled when not disabled', () => {
      const { primaryButton } = setup(false);
      expect(primaryButton).not.toBeDisabled();
    });

    it('secondary button should be enabled when not disabled', () => {
      const { secondaryButton } = setup(false);
      expect(secondaryButton).not.toBeDisabled();
    });

    it('primary button should be disabled when disabled', () => {
      const { primaryButton } = setup(true);
      expect(primaryButton).toBeDisabled();
    });

    it('secondary button should not be disabled when disabled', () => {
      const { secondaryButton } = setup(true);
      expect(secondaryButton).not.toBeDisabled();
    });
  });
});
