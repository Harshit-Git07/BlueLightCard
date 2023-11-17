import Image from '@/components/Image/Image';
import Heading from '@/components/Heading/Heading';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import Link from 'next/link';
import { BlackFridayBannerSectionProps } from './types';
import Container from '@/components/Container/Container';

const BlackFridayBannerSection = ({
  bannerSrc,
  title,
  subtitle,
  ctaText,
}: BlackFridayBannerSectionProps) => {
  return (
    <section className="w-100vw font-[MuseoSans] text-center text-[#1C1C1C] bg-[#FFFF00] h-[calc(100vh-56px)]">
      <Container nestedClassName="justify-between flex flex-col h-[calc(100vh-56px)]">
        <div className="mx-auto flex flex-col justify-center h-[calc(100vh-112px)]">
          <div className="landscapebfsm:mt-10 landscapebf:mt-10 landscapebfsm:mb-2 mt-5 mb-10 flex justify-center align-center">
            <Image
              src={bannerSrc}
              alt="Black Friday logo"
              width={0}
              height={0}
              fill={false}
              sizes="100vw"
              className="h-auto landscapebfsm:w-[150px] landscapebf:w-[250px] w-full"
              quality={100}
            />
          </div>
          <div>
            <Heading
              headingLevel={'h1'}
              className="!text-[#1C1C1C] !font-black landscapebfsm:text-xl landscapebf:text-4xl text-8xl mobile:text-5xl tablet:text-6xl laptop:text-8xl desktop:text-8xl font-bold"
            >
              {title}
            </Heading>
            <Heading
              headingLevel={'h1'}
              className="landscapebf:text-sm !text-[#1C1C1C] text-4xl mobile:text-2xl tablet:text-3xl laptop:text-3xl desktop:text-4xl"
            >
              {subtitle}
            </Heading>
          </div>
        </div>
        <div>
          <Link href={'#hero'} className="!text-[#1C1C1C] hover:text-white">
            <p className="landscapebfsm:hidden landscapebf:text-xs font-bold">{ctaText}</p>
            <p className="text-2xl">
              <span>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className="text-palette-black cursor-pointer hover:text-[#1C1C1C] ease-in duration-100"
                  data-testid="angle-down-icon"
                />
              </span>
            </p>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default BlackFridayBannerSection;
