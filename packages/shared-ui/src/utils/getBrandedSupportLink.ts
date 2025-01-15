import { BRAND } from '../types';
const currentBrand: BRAND = process.env.NEXT_PUBLIC_APP_BRAND as BRAND;

export const getBrandedSupportLink = (brand: BRAND = currentBrand) => {
  const supportUrls = {
    [BRAND.BLC_UK]:
      'https://support.bluelightcard.co.uk/hc/en-gb/requests/new?ticket_form_id=23553686637969',
    [BRAND.DDS_UK]:
      'https://support.defencediscountservice.co.uk/hc/en-gb/requests/new?ticket_form_id=25146038943889',
    [BRAND.BLC_AU]:
      'https://support-zendesk.bluelightcard.com.au/hc/en-gb/requests/new?ticket_form_id=28000130152593',
  };

  return supportUrls[brand] || supportUrls[BRAND.BLC_UK];
};
