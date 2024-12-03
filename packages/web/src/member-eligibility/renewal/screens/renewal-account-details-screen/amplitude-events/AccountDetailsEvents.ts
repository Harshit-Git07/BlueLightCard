import { AmplitudeEvents } from '@/root/src/member-eligibility/shared/amplitude-events/AmplitudeEvents';

export const accountDetailsEvents: AmplitudeEvents = {
  onFirstNameSelected: () => ({
    event: 'renewal_select',
    params: {
      page_name: 'AccountDetails',
      select_name: 'first_name',
      select_type: 'textbox',
    },
  }),
  onLastNameSelected: () => ({
    event: 'renewal_select',
    params: {
      page_name: 'AccountDetails',
      select_name: 'last_name',
      select_type: 'textbox',
    },
  }),
  onDobSelected: () => ({
    event: 'renewal_select',
    params: {
      page_name: 'AccountDetails',
      select_name: 'date_of_birth',
      select_type: 'dropdown',
    },
  }),
  onClickedBack: () => ({
    event: 'renewal_click',
    params: {
      page_name: 'AccountDetails',
      CTA: 'back',
    },
  }),
  onClickedContinue: () => ({
    event: 'renewal_click',
    params: {
      page_name: 'AccountDetails',
      CTA: 'continue',
    },
  }),
};
