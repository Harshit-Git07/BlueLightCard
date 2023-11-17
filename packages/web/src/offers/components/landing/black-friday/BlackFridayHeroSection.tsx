import Heading from '@/components/Heading/Heading';
import { BlackFridayHeroSectionProps } from './types';
import Button from '@/components/Button/Button';
import Link from 'next/link';
import Container from '@/components/Container/Container';

const BlackFridayHeroSection = ({
  title,
  subtitle,
  paragraphs,
  categoriesAndIds,
}: BlackFridayHeroSectionProps) => {
  const lastParagraphIndex = paragraphs.length ? paragraphs.length - 1 : 0;

  return (
    <section
      className="bg-black flex flex-col items-center justify-center text-white font-[MuseoSans]"
      id="hero"
    >
      <Container>
        <Heading
          className="!text-[#FFFF00] mt-20 mb-4 !font-black text-6xl text-center"
          headingLevel={'h1'}
        >
          {title}
        </Heading>
        <Heading className="text-white text-center" headingLevel={'h1'}>
          {subtitle}
        </Heading>
        <div className="text-white my-10">
          {paragraphs.map((paragraph, index) => (
            <p key={paragraph} className={`text-center ${index !== lastParagraphIndex && 'mb-5'}`}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-4 mobile:grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-3 desktop:grid-cols-3 mb-10">
          {categoriesAndIds.map(({ title, id }) => (
            <Link href={`#${id}`} key={id} className="m-4 !p-0">
              <Button
                className={`m-1 text-center font-bold font-[MuseoSans] !text-[#1C1C1C] !bg-[#FFFF00] focus:outline-0 hover:bg-[#FFFF00] cursor-pointer w-full !p-3 truncate`}
                type="button"
              >
                {title}
              </Button>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BlackFridayHeroSection;
