import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import BlcUkQrCode from '@assets/blc-uk-qr-download-app.svg';
import BlcAuQrCode from '@assets/blc-au-qr-download-app.svg';
import DdsQrCode from '@assets/dds-uk-qr-download-app.svg';
import { FC, SVGProps } from 'react';

export const AppStoreQrCode: FC<SVGProps<SVGElement>> = (props) => {
  switch (BRAND) {
    case BRANDS.BLC_UK:
      return <BlcUkQrCode {...props} data-testid="blc-uk-qr-code" />;
    case BRANDS.BLC_AU:
      return <BlcAuQrCode {...props} data-testid="blc-au-qr-code" />;
    case BRANDS.DDS_UK:
      return <DdsQrCode {...props} data-testid="dds-uk-qr-code" />;
  }
};
