import { fireEvent, render, screen } from '@testing-library/react';
import RequestNewCardReason, { radioOptions } from '.';
import { ReorderCardReason } from '@blc-mono/shared/models/members/enums/ReorderCardReason';

const mutateAsync = jest.fn();
const mockUseRequestNewCard = jest.fn().mockReturnValue({
  mutateMemberProfile: jest.fn(),
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

const mockUseMemberCard = jest.fn(() => ({
  insideReprintPeriod: true,
}));
jest.mock('../../../hooks/useMemberCard', () => ({
  __esModule: true,
  default: () => mockUseMemberCard(),
}));

describe('RequestNewCardReason', () => {
  describe('renders', () => {
    it('a form', () => {
      render(<RequestNewCardReason />);

      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('with the correct radio buttons', () => {
      render(<RequestNewCardReason />);

      radioOptions.forEach((option) => {
        expect(screen.getByRole('radio', { name: option.label })).toBeInTheDocument();
      });
    });

    it('sends the correct data', async () => {
      render(<RequestNewCardReason />);

      const notReceivedOption = radioOptions.find(
        (option) => option.id === ReorderCardReason.CARD_NOT_RECEIVED_YET,
      );
      const notReceivedButton = screen.getByRole('radio', { name: notReceivedOption?.label });

      const submitButton = screen.getByRole('button', { name: 'Next' });

      fireEvent.click(notReceivedButton);
      fireEvent.click(submitButton);

      expect(mutateAsync).toHaveBeenCalledWith({
        applicationReason: 'REPRINT',
        reorderCardReason: ReorderCardReason.CARD_NOT_RECEIVED_YET,
      });
    });
  });
});
