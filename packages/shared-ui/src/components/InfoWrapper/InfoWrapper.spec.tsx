import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoWrapper from '.';
import { ComponentProps } from 'react';

const { getByText, getByRole, queryByRole, queryByLabelText, getByLabelText } = screen;

describe('Info component', () => {
  it('should render component without error', () => {
    const { baseElement } = render(<InfoWrapper />);
    expect(baseElement).toBeTruthy();
  });

  it('should only render a label', () => {
    const props: ComponentProps<typeof InfoWrapper> = {
      label: 'Example label',
    };
    render(<InfoWrapper {...props} />);

    expect(getByText('Example label')).toBeInTheDocument();
    expect(queryByRole('p')).not.toBeInTheDocument();
    expect(queryByLabelText('information')).not.toBeInTheDocument();
  });

  it('should only render a description', () => {
    const props: ComponentProps<typeof InfoWrapper> = {
      description: 'Example description',
    };

    render(<InfoWrapper {...props} />);

    expect(getByText('Example description')).toBeInTheDocument();
    expect(queryByRole('label')).not.toBeInTheDocument();
    expect(queryByLabelText('information')).not.toBeInTheDocument();
  });

  it('should render an icon if the label present', () => {
    const props: ComponentProps<typeof InfoWrapper> = {
      label: 'Example label',
      helpText: 'Example help text',
    };

    render(<InfoWrapper {...props} />);

    expect(getByText('Example label')).toBeInTheDocument();
    expect(getByLabelText('information')).toBeInTheDocument();
  });

  it('should render label, help icon and description', () => {
    const props: ComponentProps<typeof InfoWrapper> = {
      label: 'Example label',
      helpText: 'Example help text',
      description: 'Example description',
    };

    render(<InfoWrapper {...props} />);

    expect(getByText('Example label')).toBeInTheDocument();
    expect(getByText('Example description')).toBeInTheDocument();
    expect(getByLabelText('information')).toBeInTheDocument();
  });

  it('should not render an icon if the label is empty/undefined', () => {
    const props: ComponentProps<typeof InfoWrapper> = {
      label: '',
      helpText: 'Example help text',
    };

    render(<InfoWrapper {...props} />);

    expect(queryByRole('label')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('information')).not.toBeInTheDocument();
  });

  it('should render a tooltip when a help icon is present and hovered over', async () => {
    const props: ComponentProps<typeof InfoWrapper> = {
      label: 'Example label',
      helpText: 'Example help text',
    };

    render(<InfoWrapper {...props} />);
    const icon = getByLabelText('information', {});
    const tooltip = getByRole('tooltip', {});

    expect(icon).toBeInTheDocument();
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Example help text');
  });

  it('should render children', () => {
    render(
      <InfoWrapper>
        <input role="textbox" type="text" />
      </InfoWrapper>,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
  });
});
