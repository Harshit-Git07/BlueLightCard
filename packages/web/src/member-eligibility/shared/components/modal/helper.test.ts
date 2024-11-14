import { getQrCodeForDownloadingApp } from './helper';
import BlcAuQrCode from '@assets/blc-au-qr-download-app.svg';
import BlcUkQrCode from '@assets/blc-uk-qr-download-app.svg';
import DdsQrCode from '@assets/dds-uk-qr-download-app.svg';

const mockGlobalVars = (brand: string) => {
  jest.resetModules();
  jest.doMock('@/global-vars', () => ({
    BRAND: brand,
  }));
};

describe('Download links for different brands', () => {
  describe('BLC-AU', () => {
    beforeAll(() => {
      mockGlobalVars('blc-au');
    });

    it('returns the default Apple Store link for blc-au brand', () => {
      const { getAppleStoreLinkForBrand } = require('./helper');
      expect(getAppleStoreLinkForBrand()).toBe(
        'https://apps.apple.com/au/app/blue-light-card/id1637398997'
      );
    });

    it('returns the default Google Play Store link for blc-au brand', () => {
      const { getGooglePlayStoreLinkForBrand } = require('./helper');
      expect(getGooglePlayStoreLinkForBrand()).toBe(
        'https://play.google.com/store/apps/details?id=com.au.bluelightcard.user'
      );
    });

    it('returns the default QR code for blc-au brand', () => {
      expect(getQrCodeForDownloadingApp()).toEqual(BlcAuQrCode);
    });
  });

  describe('BLC-UK', () => {
    beforeAll(() => {
      mockGlobalVars('blc-uk');
    });

    it('returns the default Apple Store link for blc-uk brand', () => {
      const { getAppleStoreLinkForBrand } = require('./helper');
      expect(getAppleStoreLinkForBrand()).toBe(
        'https://itunes.apple.com/gb/app/blue-light-card/id689970073?mt=8'
      );
    });

    it('returns the default Google Play Store link for blc-uk brand', () => {
      const { getGooglePlayStoreLinkForBrand } = require('./helper');
      expect(getGooglePlayStoreLinkForBrand()).toBe(
        'https://play.google.com/store/apps/details?id=com.bluelightcard.user&amp;hl=en_GB'
      );
    });

    it('returns the default QR code for blc-uk brand', () => {
      expect(getQrCodeForDownloadingApp()).toEqual(BlcUkQrCode);
    });
  });

  describe('DDS-UK', () => {
    beforeAll(() => {
      mockGlobalVars('dds-uk');
    });
    it('returns the default Apple Store link for dds-uk brand', () => {
      const { getAppleStoreLinkForBrand } = require('./helper');
      expect(getAppleStoreLinkForBrand()).toBe(
        'https://apps.apple.com/gb/app/defence-discount-service/id652448774'
      );
    });

    it('returns the default Google Play Store link for dds-uk brand', () => {
      const { getGooglePlayStoreLinkForBrand } = require('./helper');
      expect(getGooglePlayStoreLinkForBrand()).toBe(
        'https://play.google.com/store/search?q=defence+discount+service&c=apps'
      );
    });

    it('returns the default QR code for dds-uk brand', () => {
      expect(getQrCodeForDownloadingApp()).toEqual(DdsQrCode);
    });
  });
});
