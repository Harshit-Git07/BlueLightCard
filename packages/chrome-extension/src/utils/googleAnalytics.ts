function buildGA4CampaignQueryParameters({
  source,
  medium,
  campaign,
  content,
  term,
}: {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
}): string {
  const params = [`utm_source=${source}`, `utm_medium=${medium}`, `utm_campaign=${campaign}`];

  if (content) {
    params.push('utm_content', content);
  }
  if (term) {
    params.push('utm_term', term);
  }
  return params.join('&');
}

export const createUrlWithGA4CampaignQueryParams = (id: number, companyName: string) => {
  const baseUrl: string = 'https://www.bluelightcard.co.uk';
  const offerPage: string = `/offerdetails.php?cid=${id}`;
  const utm_campaign: string = `${companyName.toLowerCase()}-chrome-extension`;
  const ga4Params: string = buildGA4CampaignQueryParameters({
    source: 'partner-referral',
    medium: 'chrome-extension',
    campaign: utm_campaign,
  });
  return `${baseUrl}${offerPage}&${ga4Params}`;
};
