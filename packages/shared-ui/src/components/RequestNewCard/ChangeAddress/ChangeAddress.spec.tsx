import { screen, render } from '@testing-library/react';
import ChangeAddress from '.';
import { userEvent } from '@testing-library/user-event';

const mutateMemberProfile = jest.fn();
const mutateAsync = jest.fn();
const mockUseRequestNewCard = jest.fn().mockReturnValue({
  mutateMemberProfile,
  mutateAsync,
  isPending: false,
  goBack: jest.fn(),
  goNext: jest.fn(),
  memberId: 'testMemberId',
});
jest.mock('../useRequestNewCard', () => ({
  __esModule: true,
  default: () => mockUseRequestNewCard(),
}));

const mockUseMemberProfileGet = jest.fn().mockReturnValue({
  memberProfile: undefined,
});
jest.mock('../../../hooks/useMemberProfileGet', () => ({
  __esModule: true,
  default: () => mockUseMemberProfileGet(),
}));

const mockUseMemberApplication = jest.fn().mockReturnValue({
  application: undefined,
});
jest.mock('../../../hooks/useMemberApplication', () => ({
  __esModule: true,
  default: () => mockUseMemberApplication(),
}));

const renderScreen = () => {
  render(<ChangeAddress />);

  const postcodeInput = screen.getByLabelText('Postcode');
  const countyDropdown = screen.getByLabelText('County');

  const submitButton = screen.getByRole('button', { name: 'Next' });

  return { postcodeInput, countyDropdown, submitButton };
};

describe('ChangeAddress screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('on initial render', () => {
    it('triggers queries', () => {
      renderScreen();

      expect(mockUseMemberProfileGet).toHaveBeenCalled();
      expect(mockUseMemberApplication).toHaveBeenCalled();
    });

    it('loads application address data into the form if present', async () => {
      const fullAddress = {
        address1: 'testAddress1',
        address2: 'testAddress2',
        city: 'testCity',
        postcode: 'testPostcode',
        country: 'testCountry',
      };
      mockUseMemberApplication.mockReturnValue({
        application: fullAddress,
      });
      const { postcodeInput } = renderScreen();

      expect(postcodeInput).toHaveValue('testPostcode');
    });

    it('loads county from the member profile if present', async () => {
      mockUseMemberProfileGet.mockReturnValue({
        memberProfile: { county: 'Angus' },
      });
      const { countyDropdown } = renderScreen();

      expect(countyDropdown).toHaveValue('Angus');
    });
  });

  describe('submission', () => {
    it('calls both mutation methods with expected params', async () => {
      const fullAddress = {
        address1: 'testAddress1',
        address2: 'testAddress2',
        city: 'testCity',
        postcode: 'testPostcode',
        country: 'testCountry',
      };
      mockUseMemberApplication.mockReturnValue({
        application: fullAddress,
      });
      mockUseMemberProfileGet.mockReturnValue({
        memberProfile: { county: 'Angus' },
      });

      const { submitButton } = renderScreen();

      await userEvent.click(submitButton);

      expect(mutateMemberProfile).toHaveBeenCalledWith({ county: 'Angus' });
      expect(mutateAsync).toHaveBeenCalledWith({ ...fullAddress, county: 'Angus' });
    });
  });
});
