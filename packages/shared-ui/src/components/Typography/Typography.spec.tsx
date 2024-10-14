import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Typography from './';

const typographyVariants = [
  { variant: 'display-large-text', text: 'Display large text' },
  { variant: 'display-medium-text', text: 'Display medium text' },
  { variant: 'display-small-text', text: 'Display small text' },
  { variant: 'headline', text: 'Headline' },
  { variant: 'headline-bold', text: 'Headline bold' },
  { variant: 'title-large', text: 'Title large' },
  { variant: 'title-medium', text: 'Title medium' },
  { variant: 'title-semibold', text: 'Title semibold' },
  { variant: 'title-small', text: 'Title small' },
  { variant: 'body', text: 'Body' },
  { variant: 'body-light', text: 'Body light' },
  { variant: 'body-semibold', text: 'Body semi bold' },
  { variant: 'body-small', text: 'Body small' },
  { variant: 'body-small-semibold', text: 'Body small semi bold' },
  { variant: 'label', text: 'Label' },
  { variant: 'label-semibold', text: 'Label semi bold' },
  { variant: 'button', text: 'Button' },
] as const;

describe('Typography component', () => {
  it.each(typographyVariants)(
    'should render Typography $variant variant component without error',
    ({ variant, text }) => {
      render(<Typography variant={variant}>{text}</Typography>);
      const typography = screen.getByText(text);

      expect(typography).toBeInTheDocument();
      expect(typography).toHaveClass('text-heading-colour dark:text-heading-colour-dark');
    },
  );

  it('should render Typography label variant component with user provided className without error ', () => {
    render(
      <Typography className="text-red-500" variant="label">
        Label
      </Typography>,
    );
    const label = screen.getByText('Label');

    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-heading-colour dark:text-heading-colour-dark text-red-500');
  });
});
