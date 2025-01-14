import Img, { Source } from '@/ui/Img';
import CTAList from '@/ui/CTAList';
import { cn } from '@/lib/utils';
import { stegaClean } from '@sanity/client/stega';
import CTA, { CTAWithCustomProps } from '@/ui/CTA';
import Content from '../RichtextModule/Content';

function extractCTALinks(ctas?: Sanity.CTA[]) {
  const _default = { link: {}, buttons: [] } as {
    link: Sanity.CTA;
    buttons: CTAWithCustomProps[];
  };

  const acc = ctas?.reduce((acc, cta) => {
    if (cta.style === 'link') {
      acc.link = cta;
    } else {
      acc.buttons.push({
        ...cta,
        invertColor: true,
      });
    }
    return acc;
  }, _default);

  return acc ?? _default;
}

export default function Hero({
  pretitle,
  content,
  ctas,
  bgImage,
  bgImageMobile,
  textAlign = 'center',
  alignItems,
}: Readonly<
  Partial<{
    pretitle: string;
    content: any;
    ctas: Sanity.CTA[];
    bgImage: Sanity.Image;
    bgImageMobile: Sanity.Image;
    textAlign: React.CSSProperties['textAlign'];
    alignItems: React.CSSProperties['alignItems'];
  }>
>) {
  const hasImage = !!bgImage?.asset;

  const { link, buttons } = extractCTALinks(ctas);

  return (
    <section
      className={cn(hasImage && 'grid bg-ink text-canvas *:col-span-full *:row-span-full dds:h-96')}
    >
      {bgImage != null && (
        <picture className="dds:h-96">
          <Source image={bgImageMobile} />
          <Img
            className="size-full max-h-fold object-cover"
            image={bgImage}
            imageWidth={2400}
            draggable={false}
          />
        </picture>
      )}

      {content && (
        <div
          className={cn(
            'section flex w-full flex-col',
            {
              'justify-start': stegaClean(alignItems) === 'start',
              'justify-center': stegaClean(alignItems) === 'center',
              'justify-end': stegaClean(alignItems) === 'end',
            },
            {
              'items-start': stegaClean(textAlign) === 'left',
              'items-center': stegaClean(textAlign) === 'center',
              'items-end': stegaClean(textAlign) === 'right',
            },
          )}
        >
          <h2 className="text-center font-typography-display-medium font-typography-display-medium-weight text-typography-display-medium tracking-typography-display-medium leading-typography-display-medium">
            {pretitle}
          </h2>
          <div className="portable-text my-5 flex justify-center text-2xl">
            <Content value={content} />
          </div>
          <CTAList ctas={buttons} className="!mt-4" />
          {link && (
            <div className="mt-2">
              <CTA {...link} className="text-white hover:underline" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
