import { render, screen } from '@testing-library/react';
import FieldLabel from './';

describe('FieldLabel component', () => {
  const defaultProps = {
    htmlFor: 'test-input',
  };

  const setup = (props = {}) => {
    render(<FieldLabel {...defaultProps} {...props} />);
  };

  it('renders the label with correct text and attributes', () => {
    setup({ label: 'Test Label' });
    const label = document.querySelector(`label[for="${defaultProps.htmlFor}"]`);
    expect(label).toBeInTheDocument();
    expect(label?.textContent).toBe('Test Label');
  });

  it('transforms the label text case using transformTextCase', () => {
    setup({ label: 'test label' });
    const label = screen.getByText('Test label'); // Ensure the text case transformation is applied
    expect(label).toBeInTheDocument();
  });

  it('renders a tooltip when tooltip text is provided', () => {
    setup({ label: 'Test Label', tooltip: 'Tooltip text' });
    const tooltipIcon = screen.getByLabelText('information');
    expect(tooltipIcon).toBeInTheDocument();
  });

  it('does not render a tooltip when tooltip text is not provided', () => {
    setup({ label: 'Test Label' });
    const tooltipIcon = screen.queryByLabelText('information');
    expect(tooltipIcon).not.toBeInTheDocument();
  });

  it('renders the description with correct attributes', () => {
    setup({ description: 'Test description' });
    const description = screen.getByText('Test description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveAttribute('aria-label', 'Test description');
    expect(description).toHaveAttribute('id', `${defaultProps.htmlFor}-description`);
  });

  it('does not render a description when description is not provided', () => {
    setup({ label: 'Test Label' });
    const description = screen.queryByText('Test description');
    expect(description).not.toBeInTheDocument();
  });

  it('renders both label and description correctly together', () => {
    setup({ label: 'Test Label', description: 'Test description' });
    const label = screen.getByText('Test Label');
    const description = screen.getByText('Test description');
    expect(label).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it.each([
    ['right', 'left-full top-1/2 z-50 ml-3 -translate-y-1/2'],
    ['top', 'bottom-full left-1/2 z-50 mb-3 -translate-x-1/2'],
    ['left', 'right-full top-1/2 z-50 mr-3 -translate-y-1/2'],
    ['bottom', 'left-1/2 top-full z-50 mt-3 -translate-x-1/2'],
  ])('applies the correct tooltip position className for %s', (position, className) => {
    setup({ label: 'Test Label', tooltip: 'Tooltip text', tooltipPosition: position });
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass(className);
  });

  it('does not render anything if neither label nor description are provided', () => {
    const { container } = render(<FieldLabel {...defaultProps} />);
    expect(container).toBeEmptyDOMElement();
  });
});
