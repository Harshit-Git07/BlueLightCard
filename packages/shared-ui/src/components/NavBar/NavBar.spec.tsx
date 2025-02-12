import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Props } from './';
import { composeStories } from '@storybook/react';
import * as stories from './NavBar.stories';

const { Default, LinkList, MobileView } = composeStories(stories);

describe('NavBar component', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      links: [],
    };
  });

  describe('Default', () => {
    it.each([
      { Story: Default, name: 'Default' },
      { Story: MobileView, name: 'Mobile View' },
    ])('$name: should render links with matching text', ({ Story }) => {
      props.links = [
        { id: '1', label: 'Link 1', url: '/link-1' },
        { id: '2', label: 'Link 2', url: '/link-2' },
        { id: '3', label: 'Link 3', url: '/link-3' },
      ];

      render(<Story {...props} />);

      const links = screen.getAllByRole('link');

      expect(links.length).toBe(3);
      expect(links[0]).toHaveTextContent('Link 1');
      expect(links[1]).toHaveTextContent('Link 2');
      expect(links[2]).toHaveTextContent('Link 3');
    });
  });

  describe('LinkList', () => {
    it.each([
      { Story: LinkList, name: 'Link List' },
      { Story: MobileView, name: 'Mobile View with Link List' },
    ])('$name: should render link with link list', ({ Story }) => {
      props.links = [
        {
          id: '1',
          label: 'Link 1',
          url: '/link-1',
          links: [
            { id: '1', label: 'Sub link 1', url: '/sub-link-1' },
            { id: '2', label: 'Sub link 2', url: '/sub-link-2' },
          ],
        },
      ];

      render(<Story {...props} />);

      const linkButton = screen.getByRole('button', { name: 'Toggle dropdown' });
      const links = screen.getAllByRole('link');

      expect(linkButton).toBeTruthy();
      expect(links[0]).toHaveTextContent('Sub link 1');
      expect(links[1]).toHaveTextContent('Sub link 2');
    });
  });
});
