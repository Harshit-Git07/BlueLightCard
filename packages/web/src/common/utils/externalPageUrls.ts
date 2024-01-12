export const getCompanyOfferDetailsUrl = (companyId: string) => {
  return `/offerdetails.php?cid=${companyId}`;
};

export const getOffersByCategoryUrl = (categoryId: string) => {
  return `/offers.php?cat=true&type=${categoryId}`;
};

export const getOffersBySearchTermUrl = (searchTerm: string) => {
  return `/search?q=${searchTerm}`;
};
