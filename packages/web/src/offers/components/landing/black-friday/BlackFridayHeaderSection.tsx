import Image from 'next/image';
import Link from '@/components/Link/Link';

const BlackFridayHeaderSection = () => (
  <div className="bg-black">
    <Link href="/index.php" useLegacyRouting>
      <Image
        className="mx-auto"
        src="https://cdn.bluelightcard.co.uk/web/logos/blc-logo-black-friday-2023.png"
        alt="logo"
        width={323}
        height={66}
      />
    </Link>
  </div>
);

export default BlackFridayHeaderSection;
