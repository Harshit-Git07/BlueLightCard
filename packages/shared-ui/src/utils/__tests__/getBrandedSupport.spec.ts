import { BRAND } from '@/types';
import { getBrandedSupportLink } from '../getBrandedSupportLink';

describe('Support link smoke tests', () => {
  const brandedSupport: { brand: BRAND; link: string }[] = [
    {
      brand: BRAND.BLC_UK,
      link: 'https://support.bluelightcard.co.uk/hc/en-gb/requests/new?ticket_form_id=23553686637969',
    },
    {
      brand: BRAND.DDS_UK,
      link: 'https://support.defencediscountservice.co.uk/hc/en-gb/requests/new?ticket_form_id=25146038943889',
    },
    {
      brand: BRAND.BLC_AU,
      link: 'https://support-zendesk.bluelightcard.com.au/hc/en-gb/requests/new?ticket_form_id=28000130152593',
    },
  ];

  it.each(brandedSupport)('returns the correct URL for %s', (support) => {
    const link = getBrandedSupportLink(support.brand);
    expect(link).toBe(support.link);
  });

  it('should return the default BLC-UK URL for an unknown brand', () => {
    const link = getBrandedSupportLink('unknown' as BRAND);
    expect(link).toBe(
      'https://support.bluelightcard.co.uk/hc/en-gb/requests/new?ticket_form_id=23553686637969',
    );
  });
});
