import { act, render, screen } from '@testing-library/react';
import PersonalInformation from '.';
import { copy } from './copy';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@/adapters';
import { PlatformVariant } from '@/types';
import { userEvent } from '@testing-library/user-event';
import { customerProfileNoCardMock } from '@/components/PersonalInformation/mocks/customerProfile';

const mockUseMemberProfileGet = jest.fn().mockReturnValue({ isLoading: true });
jest.mock('../../hooks/useMemberProfileGet', () => ({
  __esModule: true,
  default: () => mockUseMemberProfileGet(),
}));

const mockMutationFunction = jest.fn();
jest.mock('./hooks/useMemberProfilePut', () => ({
  __esModule: true,
  useMemberProfilePut: () => ({ mutateAsync: mockMutationFunction }),
}));

const mockGetOrganisation = jest.fn().mockReturnValue({ isLoading: true });
jest.mock('../../hooks/useGetOrganisation', () => ({
  useGetOrganisation: () => mockGetOrganisation(),
}));

const mockGetEmployers = jest.fn().mockReturnValue({ isLoading: true });
jest.mock('../../hooks/useGetEmployers', () => ({
  useGetEmployers: () => mockGetEmployers(),
}));

jest.mock('../DatePicker', () => ({
  __esModule: true,
  default: () => <button>DatePicker</button>,
}));
jest.mock('../PhoneNumberInput', () => ({
  __esModule: true,
  default: () => <button>PhoneNumber</button>,
}));

const renderPersonalDetails = (status = 200, data = {}, platform = PlatformVariant.Web) => {
  const testAdapter = useMockPlatformAdapter(status, data, platform);

  render(
    <PlatformAdapterProvider adapter={testAdapter}>
      <PersonalInformation />
    </PlatformAdapterProvider>,
  );

  const saveButton = screen.getByRole('button', { name: copy.saveButtonText });

  return {
    saveButton,
  };
};

describe('PersonalInformation', () => {
  it('renders a form and a disabled save button by default', () => {
    const { saveButton } = renderPersonalDetails();

    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  describe('renders form fields:', () => {
    it('name section', () => {
      renderPersonalDetails();

      expect(screen.getAllByLabelText(copy.nameSection.firstNameLabel)[0]).toBeDisabled();
      expect(screen.getAllByLabelText(copy.nameSection.lastNameLabel)[0]).toBeDisabled();
      expect(screen.getByRole('link', { name: copy.nameSection.buttonText })).toBeInTheDocument();
    });
  });

  it('date section', () => {
    renderPersonalDetails();

    expect(screen.getByRole('combobox', { name: 'Day' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Month' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Year' })).toBeInTheDocument();
  });

  it('gender section', () => {
    renderPersonalDetails();

    expect(screen.getAllByLabelText(copy.gender.label)[1]).toBeInTheDocument();
  });

  it('email / pass section', () => {
    renderPersonalDetails();

    expect(screen.getAllByLabelText(copy.email.label)[0]).toBeDisabled();
    expect(screen.getByRole('button', { name: copy.email.buttonText })).toBeInTheDocument();
    expect(screen.getAllByLabelText(copy.password.label)[0]).toBeDisabled();
    expect(screen.getByRole('button', { name: copy.password.buttonText })).toBeInTheDocument();
  });

  it('no biometrics on web', () => {
    renderPersonalDetails();

    expect(screen.queryAllByRole('button', { name: copy.biometrics.buttonText })).toHaveLength(0);
  });

  it('biometrics on mobile hybrid', () => {
    renderPersonalDetails(200, {}, PlatformVariant.MobileHybrid);

    expect(screen.getByRole('button', { name: copy.biometrics.buttonText })).toBeInTheDocument();
  });

  it('phone number section', () => {
    renderPersonalDetails();

    expect(screen.getByRole('button', { name: 'PhoneNumber' })).toBeInTheDocument();
  });

  it('region section', () => {
    renderPersonalDetails();

    expect(screen.getAllByLabelText(copy.county.label)[0]).toBeInTheDocument();
  });

  it('employment section', () => {
    renderPersonalDetails();

    expect(screen.getAllByLabelText(copy.service.label)[1]).toBeDisabled();
    expect(screen.getByRole('link', { name: copy.service.buttonText })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: copy.division.label })).toBeDisabled();
  });
});

describe('validation', () => {
  it('is able to be submitted if any field changes from default', async () => {
    mockUseMemberProfileGet.mockReturnValue({
      isLoading: false,
      data: { data: customerProfileNoCardMock },
      memberProfile: customerProfileNoCardMock,
    });

    const { saveButton } = renderPersonalDetails();
    expect(saveButton).toBeDisabled();

    const genderDropdown = screen.getAllByLabelText(copy.gender.label)[1];
    await act(async () => await userEvent.click(genderDropdown));

    const genderList = screen.getByRole('listbox');
    await act(async () => await userEvent.selectOptions(genderList, 'Prefer not to say'));

    expect(saveButton).toBeEnabled();
  });
});

describe('EmploymentSection', () => {
  it('displays options list when employment details available', async () => {
    const mockEmployer = {
      employerId: 'testId',
      name: 'testEmployerName',
    };
    mockUseMemberProfileGet.mockReturnValue({
      isLoading: false,
      data: { data: customerProfileNoCardMock },
      memberProfile: customerProfileNoCardMock,
    });
    mockGetEmployers.mockReturnValue({ isLoading: false, data: [mockEmployer] });

    renderPersonalDetails();

    const divisionDropdown = screen.getAllByLabelText(copy.division.label)[1];
    await act(async () => await userEvent.click(divisionDropdown));

    const options = screen.getAllByRole('option');
    expect(options.length).toBe(1);
  });
});

describe('submission', () => {
  it('is able to be submitted if any field changes from default', async () => {
    mockUseMemberProfileGet.mockReturnValue({
      isLoading: false,
      data: { data: customerProfileNoCardMock },
      memberProfile: customerProfileNoCardMock,
    });

    const { saveButton } = renderPersonalDetails();
    expect(saveButton).toBeDisabled();

    const genderDropdown = screen.getAllByLabelText(copy.gender.label)[1];
    await act(async () => await userEvent.click(genderDropdown));

    const genderList = screen.getByRole('listbox');
    await act(async () => await userEvent.selectOptions(genderList, 'Prefer not to say'));

    expect(saveButton).toBeEnabled();

    await act(async () => await userEvent.click(saveButton));
    expect(mockMutationFunction).toHaveBeenCalled();
  });
});
