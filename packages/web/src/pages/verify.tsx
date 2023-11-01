import { NextPage } from 'next';
import Container from '@/components/Container/Container';
import withLayout from '@/hoc/withLayout';
import useBrandTranslation from '@/hooks/useBrandTranslation';
import { PartialLayoutProps } from '@/layouts/BaseLayout/types';
import getI18nStaticProps from '@/utils/i18nStaticProps';
import VerifyLogo from '@brandasset/verify-logo.svg';
import Button from '@/components/Button/Button';
import Video from '@/page-components/VideoFrame/VideoFrame';
import Image from '@/components/Image/Image';
import getCDNUrl from '@/utils/getCDNUrl';
import verifyPageData from '@/data/verifyPageData';
import VerifyInfoCard from '@/page-components/VerifyInfoCard/VerifyInfoCard';
import InstructionCard from '@/page-components/InstructionCard/InstructionCard';

export const getStaticProps = getI18nStaticProps;

const layoutProps: PartialLayoutProps = {
  seo: {
    title: 'seo.title',
    description: 'seo.description',
    ogTitle: 'seo.og.title',
    ogType: 'seo.og.type',
    sitename: 'seo.og.sitename',
    ogUrl: 'seo.og.url',
    ogImage: 'seo.og.image',
    twitterCard: 'seo.twitter.card',
    twitterTitle: 'seo.twitter.title',
    twitterDescription: 'seo.twitter.description',
    twitterSite: 'seo.twitter.site',
    twitterImage: 'seo.twitter.image',
    twitterImageAlt: 'seo.twitter.imageAlt',
    twitterCreator: 'seo.twitter.creator',
  },
  translationNamespace: 'verify-page',
};

const videoSrc = getCDNUrl('/web/landing-pages/verify/verify.mp4');
const verifyPOSImage = getCDNUrl('/web/landing-pages/verify/verify-pos.webp');
const verifyPhoneMockups = getCDNUrl('/web/landing-pages/verify/verify-phone-mockups.webp');

const VerifyPage: NextPage = () => {
  const { t } = useBrandTranslation('verify-page');

  return (
    <Container className="font-[MuseoSans] mt-6 mb-24">
      <div className="flex flex-col items-center text-center mb-7">
        <VerifyLogo className="mb-3" />
        <h1 className="text-5xl laptop:text-7xl font-extrabold laptop:max-w-[60%] mb-3">
          {t('pageHeading.first.title')}
        </h1>
        <p className="text-xl opacity-60 laptop:max-w-[40%] mb-4">{t('pageHeading.first.text')}</p>
        <Button type="link" href="mailto:">
          {t('button.enquire')}
        </Button>
      </div>
      <Video videoSrc={videoSrc} className="mb-8" />
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-5xl font-extrabold mb-4">{t('pageHeading.second.title')}</h2>
        <p className="text-xl mb-7">{t('pageHeading.second.text')}</p>
        <div className="flex flex-wrap justify-center">
          {verifyPageData.infoCards.map((card) => (
            <div key={card.title} className="tablet:basis-1/3 mobile-xl:basis-1/2 px-2 tablet:px-4">
              <VerifyInfoCard title={card.title} imageSrc={card.image} imageAlt={card.title}>
                <card.content />
              </VerifyInfoCard>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center mb-7">
        <h2 className="text-5xl text-center font-extrabold mb-4">{t('pageHeading.third.title')}</h2>
        <p className="text-xl text-center laptop:max-w-[70%] mb-7">{t('pageHeading.third.text')}</p>
        <div className="flex flex-wrap justify-center">
          {verifyPageData.instructionCards.map((card) => (
            <div
              key={card.title}
              className="flex tablet:basis-1/3 mobile-xl:basis-1/2 my-2 mobile-xl:my-4 tablet:px-4"
            >
              <InstructionCard title={card.title} imageSrc={card.image} imageAlt={card.title}>
                <card.content />
              </InstructionCard>
            </div>
          ))}
        </div>
      </div>
      <div className="tablet:flex rounded-2xl overflow-hidden bg-palette-primary/20 mb-8">
        <div className="tablet:w-1/2 tablet:p-8 p-6">
          <h2 className="text-5xl font-extrabold mb-5">{t('contentBox.first.title')}</h2>
          <p className="text-xl mb-4">{t('contentBox.first.text')}</p>
          <p className="text-xl opacity-60 laptop:max-w-[60%]">{t('contentBox.first.subtext')}</p>
        </div>
        <div className="mobile:min-h-[250px] tablet:w-1/2 tablet:min-h-[350px] relative">
          <Image src={verifyPOSImage} alt="Verify POS" />
        </div>
      </div>
      <div className="tablet:rounded-2xl overflow-hidden bg-palette-body-text/5 tablet:py-8 py-6 mb-7 -mx-5 tablet:mx-0">
        <div className="laptop:flex gap-5 mb-6 tablet:px-8 px-5">
          <div className="laptop:w-2/5 pr-5 mb-7">
            <h2 className="text-5xl font-extrabold mb-5">{t('contentBox.second.title')}</h2>
            <p className="text-xl">{t('contentBox.second.text')}</p>
          </div>
          <div className="tablet:flex laptop:w-3/5 gap-8 desktop:pl-20">
            <div className="tablet:w-1/2 mb-5">
              <h3 className="text-2xl font-bold mb-3">
                {t('contentBox.second.lists.first.title')}
              </h3>
              <ul className="list-disc ml-4 pl-2 opacity-70">
                {(
                  t('contentBox.second.lists.first.items', { returnObjects: true }) as string[]
                ).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="tablet:w-1/2">
              <h3 className="text-2xl font-bold mb-3">
                {t('contentBox.second.lists.second.title')}
              </h3>
              <ul className="list-disc ml-4 pl-2 opacity-70">
                {(
                  t('contentBox.second.lists.second.items', { returnObjects: true }) as string[]
                ).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="tablet:pb-[48%] pb-[60%] relative tablet:-mb-36">
          <Image
            src={verifyPhoneMockups}
            alt="Verify with phone"
            className="tablet:px-1 mobile:max-tablet:object-cover "
          />
        </div>
      </div>
      <div className="flex flex-col items-center text-center mb-7">
        <VerifyLogo className="mb-3" />
        <h2 className="text-5xl laptop:text-7xl font-extrabold laptop:max-w-[60%] mb-3">
          {t('pageHeading.first.title')}
        </h2>
        <p className="text-xl opacity-60 laptop:max-w-[60%] mb-4">{t('pageFooter.first.text')}</p>
        <Button type="link" href="mailto:">
          {t('button.enquire')}
        </Button>
      </div>
    </Container>
  );
};

export default withLayout(VerifyPage, layoutProps);
