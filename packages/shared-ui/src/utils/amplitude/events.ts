const events = {
  CATEGORY: {
    CARD_CLICKED: 'category_card_clicked',
    PAGE_VIEWED: 'category_viewed',
  },
  ERROR_STATE: {
    CTA_CLICKED: 'error_state_cta_clicked',
    VIEWED: 'error_state_viewed',
  },
  FEATURED_OFFERS: {
    CARD_CLICKED: 'featured_offers_card_clicked',
  },
  FLEXIBLE_OFFERS: {
    CARD_CLICKED: 'flexi_menu_card_clicked',
    PAGE_VIEWED: 'flexi_menu_viewed',
  },
  OFFER_SHARE_CLICKED: 'offer_share_clicked',
  OFFER_TERMS_CLICKED: 'offer_terms_clicked',
  OFFER_VIEWED: 'offer_viewed',
  OFFER_VIEWED_ERROR: 'offer_viewed_error',
  REQUEST_CODE_CLICKED: 'request_code_clicked',
  USE_CODE_CLICKED: 'use_code_clicked',
  VAULT_CODE_REDIRECT_TO_VAULT: 'vault_code_redirect_to_vault',
  VAULT_CODE_REQUEST_CODE_CLICKED: 'vault_code_request_code_clicked',
  VAULT_CODE_USE_CODE_CLICKED: 'vault_code_use_code_clicked',
};

export default events;
