import { render, screen, fireEvent } from '@testing-library/react';
import Alert from './index';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import { fas, IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { State } from './alertTypes';
import Button from '../Button';

describe('Alert Component', () => {
  test('renders correctly for Banner variant', () => {
    const tree = renderer
      .create(
        <Alert
          variant="Banner"
          state="Success"
          title="This is a banner alert!"
          subtext={<p>Operation completed successfully.</p>}
          isDismissable={true}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders correctly for Inline variant', () => {
    const tree = renderer
      .create(
        <Alert
          variant="Inline"
          state="Info"
          title="This is an inline alert!"
          subtext={<p>Some important information here.</p>}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('displays the correct title and subtext for Banner alert', () => {
    render(
      <Alert
        variant="Banner"
        state="Warning"
        title="Warning!"
        subtext={<p>Please check your input.</p>}
        isDismissable={true}
      />,
    );

    const bannerElement = screen.getByTestId('alertBanner');
    expect(bannerElement).toBeInTheDocument();

    expect(screen.getByText('Warning!')).toBeInTheDocument();
    expect(screen.getByText('Please check your input.')).toBeInTheDocument();
  });

  test('does not render dismiss button for Inline alert', () => {
    render(
      <Alert variant="Inline" state="Info" title="Information" subtext="This is an info alert." />,
    );

    const inlineElement = screen.getByTestId('alertInline');
    expect(inlineElement).toBeInTheDocument();

    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
  });

  test('dismisses the Banner alert when the dismiss button is clicked', () => {
    render(
      <Alert
        variant="Banner"
        state="Error"
        title="Error!"
        subtext={<p>An error occurred.</p>}
        isDismissable={true}
      />,
    );

    const bannerElement = screen.getByTestId('alert');
    expect(bannerElement).toBeInTheDocument();

    expect(screen.getByText('Error!')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close'));

    expect(screen.queryByText('Error!')).toBeNull();
  });

  const iconTests: Array<{ state: Exclude<State, 'Default'>; expectedIcon: IconDefinition }> = [
    { state: 'Success', expectedIcon: fas.faCheckCircle },
    { state: 'Info', expectedIcon: fas.faInfoCircle },
    { state: 'Warning', expectedIcon: fas.faExclamationTriangle },
    { state: 'Error', expectedIcon: fas.faTimesCircle },
  ];

  iconTests.forEach(({ state, expectedIcon }) => {
    test(`renders the correct icon for ${state} alert`, () => {
      render(
        <Alert
          variant="Banner"
          state={state}
          title={`${state} Alert`}
          subtext={<p>This is a ${state.toLowerCase()} alert.</p>}
        />,
      );

      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-icon', expectedIcon.iconName);
    });
  });

  test('renders banner default state and mandatory custom icon and title, including strong and italic text', () => {
    render(
      <Alert
        variant="Banner"
        icon="faCircle"
        state="Default"
        title="Default Banner with icon and title"
        subtext={
          <>
            <p>
              This is the <strong>first line</strong>
            </p>
            <p>
              This is the <i>second line</i>
            </p>
          </>
        }
      />,
    );

    const bannerElement = screen.getByTestId('alertBanner');
    expect(bannerElement).toBeInTheDocument();

    const title = screen.getByText('Default Banner with icon and title');
    expect(title).toBeInTheDocument();

    const subtextOne = screen.getByText((content, element) => {
      return element?.textContent === 'This is the first line';
    });
    expect(subtextOne).toBeInTheDocument();

    const subtextTwo = screen.getByText((content, element) => {
      return element?.textContent === 'This is the second line';
    });
    expect(subtextTwo).toBeInTheDocument();

    const strongText = screen.getByText('first line');
    expect(strongText.tagName).toBe('STRONG');

    const italicText = screen.getByText('second line');
    expect(italicText.tagName).toBe('I');

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon', 'circle');
  });

  test('renders inline default state and mandatory custom icon and title, including strong and italic text', () => {
    render(
      <Alert
        variant="Inline"
        icon="faCircle"
        state="Default"
        title="Default Banner with icon and title"
        subtext={
          <>
            <p>
              This is the <strong>first line</strong>
            </p>
            <p>
              This is the <i>second line</i>
            </p>
          </>
        }
      />,
    );

    const inlineElement = screen.getByTestId('alertInline');
    expect(inlineElement).toBeInTheDocument();

    const title = screen.getByText('Default Banner with icon and title');
    expect(title).toBeInTheDocument();

    const subtextOne = screen.getByText((content, element) => {
      return element?.textContent === 'This is the first line';
    });
    expect(subtextOne).toBeInTheDocument();

    const subtextTwo = screen.getByText((content, element) => {
      return element?.textContent === 'This is the second line';
    });
    expect(subtextTwo).toBeInTheDocument();

    const strongText = screen.getByText('first line');
    expect(strongText.tagName).toBe('STRONG');

    const italicText = screen.getByText('second line');
    expect(italicText.tagName).toBe('I');

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon', 'circle');
  });

  test('renders full width alert when inline', () => {
    render(
      <Alert
        variant="Inline"
        state="Success"
        title="Full Width Alert!"
        subtext={<p>This alert takes the full width.</p>}
        isFullWidth
      />,
    );

    const bannerElement = screen.getByTestId('alertInline');
    expect(bannerElement).toBeInTheDocument();
    const alert = screen.getByText('Full Width Alert!');
    expect(alert).toHaveClass('w-full');
  });

  test('renders with custom background color', () => {
    render(
      <Alert
        variant="Banner"
        state="Success"
        title="Custom Background Color Alert!"
        subtext={<p>This alert has a custom background color.</p>}
        alertBackgroundColor="bg-colour-primary-light"
      />,
    );
    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('bg-colour-primary-light');
  });

  test('renders with custom icon accent color', () => {
    render(
      <Alert
        variant="Banner"
        state="Success"
        title="Custom Icon Accent Color Alert!"
        subtext={<p>This alert has a custom icon accent color.</p>}
        iconAccentColor="text-colour-onSurface-light"
      />,
    );

    const icon = screen.getByTestId('alert-icon');
    expect(icon).toHaveClass('text-colour-onSurface-light');
  });

  test('renders children as a button and handles click events', () => {
    const handleClick = jest.fn();

    render(
      <Alert variant="Banner" title="This is a banner with a button" state="Success">
        <Button type="button" onClick={handleClick}>
          Click me
        </Button>
      </Alert>,
    );

    const button = screen.getByRole('button', { name: /Click me/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
