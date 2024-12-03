import BlcImage from '@assets/uk-modal-banner.svg';
import DdsImage from '@assets/dds-modal-banner.svg';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';

export function getModalImage() {
  if (BRAND === BRANDS.DDS_UK) {
    return DdsImage;
  }
  return BlcImage;
}
