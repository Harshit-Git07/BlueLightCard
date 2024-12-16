import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type JobDetailSubmissionType =
  | 'single-id'
  | 'multi-id'
  | 'id-verification-skipped'
  | 'payment-skipped';

export async function givenJobDetailsAreFilledIn(
  type: JobDetailSubmissionType = 'single-id'
): Promise<void> {
  switch (type) {
    case 'single-id': {
      await givenJobDetailsAreFilledInWith({
        employer: 'Single ID Employer',
      });
      break;
    }
    case 'multi-id': {
      await givenJobDetailsAreFilledInWith({
        employer: 'Multi-ID Employer',
      });
      break;
    }
    // TODO: Replace this with promocode submission when that is possible
    case 'id-verification-skipped': {
      fireEvent.keyDown(window, {
        key: '.',
        ctrlKey: true,
      });

      const nextButton = screen.getByTestId('next-button-3');
      await act(async () => nextButton.click());
      break;
    }
    // TODO: Replace this with promocode submission when that is possible
    case 'payment-skipped': {
      fireEvent.keyDown(window, {
        key: '.',
        ctrlKey: true,
      });

      const nextButton = screen.getByTestId('next-button-4');
      await act(async () => nextButton.click());
      break;
    }
  }
}

interface JobDetailEntries {
  org?: string;
  employer?: string;
}

async function givenJobDetailsAreFilledInWith(
  jobDetailEntries: JobDetailEntries = {}
): Promise<void> {
  const organisationDropdown = screen.getByTestId('organisation-dropdown');
  await act(async () => {
    await userEvent.type(
      within(organisationDropdown).getByTestId('combobox'),
      jobDetailEntries.org ?? 'Single ID Org'
    );
  });
  await userEvent.keyboard('{ArrowDown}');
  await act(() => userEvent.keyboard('{Enter}'));

  const employerDropdown = await waitFor(() => screen.getByTestId('employer-dropdown'));
  await act(async () => {
    await userEvent.type(
      within(employerDropdown).getByTestId('combobox'),
      jobDetailEntries.employer ?? 'Single ID Employer'
    );
  });
  await userEvent.keyboard('{ArrowDown}');
  await act(() => userEvent.keyboard('{Enter}'));

  const jobTitleInput = await waitFor(async () => screen.getByTestId('job-title'));
  await act(async () => {
    await userEvent.type(jobTitleInput, 'A Job');
  });

  const nextButton = screen.getByTestId('job-details-next-button');
  await act(async () => nextButton.click());
}
