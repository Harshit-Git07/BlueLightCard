import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import BlcUkQrCode from '@assets/blc-uk-qr-download-app.svg';
import BlcAuQrCode from '@assets/blc-au-qr-download-app.svg';
import DdsQrCode from '@assets/dds-uk-qr-download-app.svg';

export function getAppleStoreLinkForBrand(): string {
  switch (BRAND) {
    case BRANDS.DDS_UK:
      return 'https://apps.apple.com/gb/app/defence-discount-service/id652448774';
    case BRANDS.BLC_AU:
      return 'https://apps.apple.com/au/app/blue-light-card/id1637398997';
    default:
      return 'https://itunes.apple.com/gb/app/blue-light-card/id689970073?mt=8';
  }
}

export function getGooglePlayStoreLinkForBrand(): string {
  switch (BRAND) {
    case BRANDS.DDS_UK:
      return 'https://play.google.com/store/search?q=defence+discount+service&c=apps';
    case BRANDS.BLC_AU:
      return 'https://play.google.com/store/apps/details?id=com.au.bluelightcard.user';
    default:
      return 'https://play.google.com/store/apps/details?id=com.bluelightcard.user&amp;hl=en_GB';
  }
}

export function getQrCodeForDownloadingApp(): any {
  switch (BRAND) {
    case BRANDS.DDS_UK:
      return DdsQrCode;
    case BRANDS.BLC_AU:
      return BlcAuQrCode;
    default:
      return BlcUkQrCode;
  }
}
