import Image from 'next/image';
import Link from '@/components/Link/Link';

const BlackFridayHeaderSection = () => (
  <div className="bg-black">
    <Link href="/index.php" useLegacyRouting>
      <Image
        className="mx-auto w-[323px] h-[66px]"
        src="https://cdn.bluelightcard.co.uk/web/logos/blc-logo-black-friday-2023.png"
        alt="logo"
        width={323}
        height={66}
        quality={100}
      />
    </Link>
  </div>
);

export default BlackFridayHeaderSection;
