import Link from '@/components/Link/Link';
import Image from '@/components/Image/Image';
import { PromoBannerProps } from './types';

const PromoBanner = ({ image, href, id }: PromoBannerProps) => {
  return (
    <div className="w-full relative">
      <Link href={href} useLegacyRouting data-testid={id}>
        <Image
          src={image}
          alt="Banner image"
          fill={false}
          width="0"
          height="0"
          sizes="100vw"
          className={'h-auto w-full'}
          quality={50}
        />
      </Link>
    </div>
  );
};

export default PromoBanner;
