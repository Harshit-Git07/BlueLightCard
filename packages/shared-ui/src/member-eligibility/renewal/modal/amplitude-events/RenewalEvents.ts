export const renewalEvents = {
  onClickRenewMembership: {
    event: 'renewal_click',
    params: {
      page_name: 'RenewalModal',
      CTA: 'renew_membership',
    },
  },
  onClickLater: {
    event: 'renewal_click',
    params: {
      page_name: 'RenewalModal',
      CTA: 'close',
    },
  },
};
