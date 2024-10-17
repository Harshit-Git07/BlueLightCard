import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoWrapper from '.';
import { ComponentProps } from 'react';

describe('Info component', () => {
  let props: ComponentProps<typeof InfoWrapper> = {};

  beforeEach(() => {
    props = {};
  });

  it('should render component without error', () => {
    const { baseElement } = render(<InfoWrapper />);
    expect(baseElement).toBeTruthy();
  });

  it('should only render a label', () => {
    props = {
      label: 'Example label',
    };

    const { getByText, queryByRole, queryByLabelText } = render(<InfoWrapper {...props} />);

    expect(getByText('Example label')).toBeInTheDocument();
    expect(queryByRole('p')).not.toBeInTheDocument();
    expect(queryByLabelText('information')).not.toBeInTheDocument();
  });

  it('should only render a description', () => {
    props = {
      description: 'Example description',
    };

    const { getByText, queryByRole, queryByLabelText } = render(<InfoWrapper {...props} />);

    expect(getByText('Example description')).toBeInTheDocument();
    expect(queryByRole('label')).not.toBeInTheDocument();
    expect(queryByLabelText('information')).not.toBeInTheDocument();
  });

  it('should render an icon if the label present', () => {
    props = {
      label: 'Example label',
      helpIcon: true,
      helpText: 'Example help text',
    };

    const { getByText, getByLabelText } = render(<InfoWrapper {...props} />);

    expect(getByText('Example label')).toBeInTheDocument();
    expect(getByLabelText('information')).toBeInTheDocument();
  });

  it('should render label, help icon and description', () => {
    props = {
      label: 'Example label',
      helpIcon: true,
      helpText: 'Example help text',
      description: 'Example description',
    };

    const { getByText, getByLabelText } = render(<InfoWrapper {...props} />);

    expect(getByText('Example label')).toBeInTheDocument();
    expect(getByText('Example description')).toBeInTheDocument();
    expect(getByLabelText('information')).toBeInTheDocument();
  });

  it('should not render an icon if the label is empty/undefined', () => {
    props = {
      label: '',
      helpIcon: true,
      helpText: 'Example help text',
    };

    const { queryByLabelText, queryByRole } = render(<InfoWrapper {...props} />);

    expect(queryByRole('label')).not.toBeInTheDocument();
    expect(queryByLabelText('information')).not.toBeInTheDocument();
  });

  it('should render a tooltip when a help icon is present and hovered over', async () => {
    props = {
      label: 'Example label',
      helpIcon: true,
      helpText: 'Example help text',
    };

    const { getByLabelText, getByRole } = render(<InfoWrapper {...props} />);
    const icon = getByLabelText('information');
    const tooltip = getByRole('tooltip');

    expect(icon).toBeInTheDocument();
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Example help text');
  });

  it('should render children', () => {
    const { getByRole } = render(
      <InfoWrapper>
        <input role="textbox" type="text" />
      </InfoWrapper>,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
  });
});
