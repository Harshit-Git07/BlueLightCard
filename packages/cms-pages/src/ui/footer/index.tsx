import { getSite } from '@/lib/sanity/queries';
import Link from 'next/link';
import Img from '../Img';
import { getBrand } from '@/app/actions';
import SocialMediaIcon, { SocialMediaIconProps } from './components/SocialMediaIcon';
import { mapToNavLinks } from '@/lib/utils';
import { staticContent } from './static';
import Image from 'next/image';

export default async function Footer() {
  const brand = await getBrand();
  const { logo, social, footerMenu, title } = await getSite(brand);

  const socialLinks = mapToNavLinks(social?.items);
  const navigation = mapToNavLinks(footerMenu?.items);

  const staticContentForBrand = staticContent[brand];

  return (
    <div className="bg-footer-bg-colour-light dark:bg-footer-bg-colour-dark text-footer-text-colour dark:text-footer-text-colour-dark pt-11 px-5 w-auto">
      <div className="desktop:container desktop:mx-auto grid grid-cols-3 items-center justify-items-center">
        <div className="flex items-center col-span-3 laptop:justify-self-start laptop:col-span-1 laptop:order-1 h-12 mobile-xl:h-16">
          {logo.image.default && (
            <Link href="/">
              <Img
                image={logo.image.default as Sanity.Image}
                className="max-w-[200px] mobile-xl:max-w-[280px]"
              />
            </Link>
          )}
        </div>

        <div className="col-span-3 order-5 justify-self-center laptop:col-span-1 laptop:order-2">
          {socialLinks.length > 0 && (
            <div className="flex gap-10">
              {socialLinks.map((link, idx) => {
                const id = `${link.label}_${idx}`;
                return (
                  <SocialMediaIcon
                    key={id}
                    iconName={link.label as SocialMediaIconProps['iconName']}
                    link={link.url ?? '/'}
                    helpText={link.label}
                    id={id}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div
          data-testid="download-links"
          className="col-span-3 order-4 my-4 mb-6 laptop:justify-self-end laptop:mb-0 laptop:my-0 laptop:col-span-1 laptop:order-3 flex gap-[23px]"
        >
          {staticContentForBrand.appStoreLinks?.map((link) => (
            <Link key={encodeURI(link.url)} href={link.url} title={link.title}>
              <Image src={link.image} alt={link.title ?? link.image} width={112} height={33} />
            </Link>
          ))}
        </div>

        <hr className="col-span-3 order-2 w-full laptop:order-4 tablet:mb-11 mb-[28px] mt-6 border-footer-divider-colour dark:border-footer-divider-colour-dark" />

        <div className="col-span-3 order-3 laptop:order-5 desktop:container desktop:gap-x-44 flex laptop:gap-x-12 laptop:flex w-full desktop:mx-auto mx-6">
          {staticContentForBrand.textContent && (
            <div
              data-testid="desktop-text-block"
              className="hidden laptop:inline-block w-1/2 tablet:w-96 pb-6 text-footer-text-colour dark:text-footer-text-colour-dark font-footer-text-font text-footer-text-font font-footer-text-font-weight tracking-footer-text-font leading-footer-text-font"
            >
              {staticContentForBrand.textContent}
            </div>
          )}

          {navigation.length > 0 && (
            <div
              data-testid="footer-nav-links"
              className="desktop:flex laptop:grid-cols-3 grid grid-cols-1 mobile-xl:grid-cols-2 laptop:flex-row flex-col flex-auto justify-between"
            >
              {navigation.map((link, idx) => (
                <div key={`${link.label}_${idx}`} className="pb-6 min-w-34 flex-col flex space-y-2">
                  <h2 className="mb-2 font-footer-sectionHeading-font text-footer-text-colour dark:text-footer-text-colour-dark font-footer-sectionHeading-font font-footer-sectionHeading-font-weight text-footer-sectionHeading-font tracking-footer-sectionHeading-font leading-footer-sectionHeading-font">
                    {link.label}
                  </h2>

                  {link.links?.map((sublink, idx) => (
                    <Link
                      key={`${sublink.label}_${idx}`}
                      href={sublink.url as string}
                      className="text-footer-text-colour hover:opacity-100 dark:text-footer-text-colour-dark hover:text-footer-link-hover-colour dark:hover:text-footer-link-hover-colour-dark font-footer-text-font text-footer-text-font font-footer-text-font-weight tracking-footer-text-font leading-footer-text-font"
                    >
                      {sublink.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-3 order-6 py-10 laptop:pt-6 w-full text-center">
          {staticContentForBrand.textContent && (
            <div
              data-testid="mobile-text-block"
              className="text-center laptop:hidden mx-auto pb-6 text-footer-text-colour dark:text-footer-text-colour-dark font-footer-text-font text-footer-text-font font-footer-text-font-weight tracking-footer-text-font leading-footer-text-font"
            >
              {staticContentForBrand.textContent}
            </div>
          )}
          <p className="desktop:mx-auto text-footer-text-colour dark:text-footer-text-colour-dark font-footer-copyright-font font-footer-copyright-font-weight text-footer-copyright-font tracking-footer-copyright-font leading-footer-copyright-font">
            &copy; {title} {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
