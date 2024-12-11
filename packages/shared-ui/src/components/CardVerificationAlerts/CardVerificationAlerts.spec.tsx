import { ApplicationSchema, ProfileSchema } from './types';
import { render, screen } from '@testing-library/react';
import CardVerificationBanner from '.';
import { copy } from './copy';
import { defaultApplication, defaultProfile } from './testData';

const mockUseMemberApplication = jest.fn();
jest.mock('../RequestNewCard/useMemberApplication', () => ({
  __esModule: true,
  default: () => mockUseMemberApplication(),
}));

const awaitingIdProfile: ApplicationSchema = {
  ...defaultApplication,
  applicationReason: 'SIGNUP',
  eligibilityStatus: 'INELIGIBLE',
};
const awaitingIdApprovalProfile: ApplicationSchema = {
  ...defaultApplication,
  applicationReason: 'SIGNUP',
  eligibilityStatus: 'AWAITING_ID_APPROVAL',
  verificationMethod: 'other',
};
const rejectedProfile: ApplicationSchema = {
  ...defaultApplication,
  applicationReason: 'SIGNUP',
  eligibilityStatus: 'INELIGIBLE',
  rejectionReason: 'BLURRY_IMAGE_DECLINE_ID',
};

const testUuid = 'testUuid';

describe('CardVerificationAlert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders awaitingId banner', () => {
    mockUseMemberApplication.mockReturnValue({ application: awaitingIdProfile });

    const { container } = render(<CardVerificationBanner memberUuid={testUuid} />);

    expect(
      screen.getByText(copy.awaitingId.title.replace('{brandTitle}', 'Blue Light Card')),
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders awaitingIdApproval banner', () => {
    mockUseMemberApplication.mockReturnValue({ application: awaitingIdApprovalProfile });

    const { container } = render(<CardVerificationBanner memberUuid={testUuid} />);

    expect(screen.getByText(copy.awaitingIdApproval.title)).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders rejection banner', () => {
    mockUseMemberApplication.mockReturnValue({ application: rejectedProfile });

    const { container } = render(<CardVerificationBanner memberUuid={testUuid} />);

    expect(screen.getByText(copy.rejected.title)).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders nothing for any other application reason', () => {
    const otherApplicationReasonProfile: ProfileSchema = {
      ...defaultProfile,
      applications: [
        {
          ...defaultApplication,
          applicationReason: 'NAME_CHANGE',
        },
      ],
    };
    mockUseMemberApplication.mockReturnValue({ application: otherApplicationReasonProfile });

    const { container } = render(<CardVerificationBanner memberUuid={testUuid} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for no profile', () => {
    mockUseMemberApplication.mockReturnValue({ application: null });

    const { container } = render(<CardVerificationBanner memberUuid={testUuid} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for no applications', () => {
    mockUseMemberApplication.mockReturnValue({ data: {} });

    const { container } = render(<CardVerificationBanner memberUuid={testUuid} />);

    expect(container).toBeEmptyDOMElement();
  });
});
