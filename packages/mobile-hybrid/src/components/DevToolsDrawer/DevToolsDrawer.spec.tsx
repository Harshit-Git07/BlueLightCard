import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';
import * as stories from './DevToolsDrawer.stories';

const { Default } = composeStories(stories);

describe('DevToolsDrawer component', () => {
  it('should render component without error', () => {
    const { baseElement } = render(<Default />);

    expect(baseElement).toBeTruthy();
  });

  describe('dev tools button', () => {
    it('should render', () => {
      render(<Default />);
      const devToolsButton = screen.getByText('Open Dev Tools');

      expect(devToolsButton).toBeInTheDocument();
    });
  });

  describe('dev URL input', () => {
    it('should render', () => {
      render(<Default />);
      const devToolsButton = screen.getByText('Open Dev Tools');
      fireEvent.click(devToolsButton);

      const devUrl = screen.getByLabelText('Dev URL');
      expect(devUrl).toBeInTheDocument();
    });

    it('should redirect the page when changed', async () => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://localhost',
          pathname: '',
        },
        writable: true,
      });

      render(<Default />);
      const devToolsButton = screen.getByText('Open Dev Tools');
      fireEvent.click(devToolsButton);

      const devUrl = screen.getByLabelText('Dev URL');
      await userEvent.clear(devUrl);
      await userEvent.type(devUrl, 'test-url');
      await userEvent.keyboard('{Enter}');

      expect(window.location.href).toEqual('test-url');
    });
  });
});
