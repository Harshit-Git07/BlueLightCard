import { FC } from 'react';
import { FooterNavigationLink, FooterNavigationSection, FooterProps } from './types';
import Link from 'next/link';
import SocialMediaIcon from '../../SocialMediaIcon/SocialMediaIcon';
import SocialMediaIconProps from '../../SocialMediaIcon/types';
import { navLinks } from '@/root/data/headerConfig';
import AppleSVG from '@assets/apple.svg';
import GooglePlaySVG from '@assets/googleplay.svg';
import Logo from '../../Logo';
import { BRANDS } from '../../../types/brands.enum';
import { getFooterDetails } from './helpers/getFooterDetails';
import { BRAND, ZENDESK_V1_BLC_UK_URL } from '@/root/global-vars';
import { useAmplitudeExperiment } from '../../../context/AmplitudeExperiment';
import { AmplitudeExperimentFlags } from '../../../utils/amplitude/AmplitudeExperimentFlags';
const Footer: FC<FooterProps> = ({ isAuthenticated }) => {
  const {
    copyrightText,
    textBlock,
    navigationItems,
    socialLinks,
    appleStoreLink,
    googlePlayStoreLink,
  } = getFooterDetails(BRAND as BRANDS, isAuthenticated);

  const footerLinkTextClasses =
    'text-footer-text-colour hover:opacity-100 dark:text-footer-text-colour-dark hover:text-footer-link-hover-colour dark:hover:text-footer-link-hover-colour-dark font-footer-text-font text-footer-text-font font-footer-text-font-weight tracking-footer-text-font leading-footer-text-font';

  // Calling amplitude experiment to check if zendesk is enabled
  const zendeskExperiment = useAmplitudeExperiment(
    AmplitudeExperimentFlags.ZENDESK_V1_BLCUK,
    'off'
  );

  const isZendeskV1BlcUkEnabled = zendeskExperiment.data?.variantName === 'on';

  return (
    <div className="bg-footer-bg-colour-light dark:bg-footer-bg-colour-dark text-footer-text-colour dark:text-footer-text-colour-dark pt-11 px-5 w-auto">
      <div className="desktop:container desktop:mx-auto grid grid-cols-3 items-center justify-items-center">
        <div className="col-span-3 laptop:justify-self-start laptop:col-span-1 laptop:order-1 h-12 mobile-xl:h-16">
          <Logo url={navLinks.homeUrl} className="h-full" />
        </div>
        <div className="col-span-3 order-5 justify-self-center laptop:col-span-1 laptop:order-2">
          {socialLinks && (
            <div className="flex gap-10">
              {socialLinks.map((link: SocialMediaIconProps, index) => {
                return (
                  <SocialMediaIcon
                    key={index}
                    iconName={link.iconName}
                    link={link.link}
                    helpText={link.helpText}
                    id={link.iconName + '-link'}
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
          {appleStoreLink && (
            <Link href={appleStoreLink} title={'Get the app on Apple store'}>
              <AppleSVG className="fill-black w-28 dark:fill-white" />
            </Link>
          )}
          {googlePlayStoreLink && (
            <Link href={googlePlayStoreLink} title={'Get the app on Google Play store'}>
              <GooglePlaySVG className="fill-black w-28 dark:fill-white" />
            </Link>
          )}
        </div>

        <hr className="col-span-3 order-2 w-full laptop:order-4 tablet:mb-11 mb-[28px] mt-6 border-footer-divider-colour dark:border-footer-divider-colour-dark" />

        <div className="col-span-3 order-3 laptop:order-5 desktop:container desktop:gap-x-44 flex laptop:gap-x-12 laptop:flex w-full desktop:mx-auto mx-6">
          {textBlock && (
            <div
              data-testid="desktop-text-block"
              className="hidden laptop:inline-block w-1/2 tablet:w-96 pb-6 text-footer-text-colour dark:text-footer-text-colour-dark font-footer-text-font text-footer-text-font font-footer-text-font-weight tracking-footer-text-font leading-footer-text-font"
            >
              {textBlock}
            </div>
          )}

          {navigationItems.length > 0 && (
            <div
              data-testid="footer-nav-links"
              className="desktop:flex laptop:grid-cols-3 grid grid-cols-1 mobile-xl:grid-cols-2 laptop:flex-row flex-col flex-auto flex-1 justify-between"
            >
              {navigationItems.length > 0 &&
                navigationItems.map((section: FooterNavigationSection, index) => {
                  return (
                    <div key={index} className="pb-6 min-w-34 flex-col flex space-y-2">
                      <h2 className="mb-2 font-footer-sectionHeading-font text-footer-text-colour dark:text-footer-text-colour-dark font-footer-sectionHeading-font font-footer-sectionHeading-font-weight text-footer-sectionHeading-font tracking-footer-sectionHeading-font leading-footer-sectionHeading-font">
                        {section.title}
                      </h2>
                      {section.navLinks.map((navLink: FooterNavigationLink, navLinkIndex) => {
                        return (
                          <Link
                            key={navLinkIndex}
                            href={
                              isZendeskV1BlcUkEnabled && navLink.label === 'Contact Us'
                                ? ZENDESK_V1_BLC_UK_URL
                                : navLink.url
                            }
                            className={footerLinkTextClasses}
                          >
                            {navLink.label}
                          </Link>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <div className="col-span-3 order-6 py-10 laptop:pt-6 w-full text-center">
          {textBlock && (
            <div
              data-testid="mobile-text-block"
              className="text-center laptop:hidden mx-auto pb-6 text-footer-text-colour dark:text-footer-text-colour-dark font-footer-text-font text-footer-text-font font-footer-text-font-weight tracking-footer-text-font leading-footer-text-font"
            >
              {textBlock}
            </div>
          )}
          <p className="desktop:mx-auto text-footer-text-colour dark:text-footer-text-colour-dark font-footer-copyright-font font-footer-copyright-font-weight text-footer-copyright-font tracking-footer-copyright-font leading-footer-copyright-font">
            {copyrightText}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Footer;
