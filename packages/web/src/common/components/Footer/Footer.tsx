import { FC } from 'react';
import { FooterNavigationLink, FooterNavigationSection, FooterProps, downloadLink } from './types';
import Link from 'next/link';
import Image from '../Image/Image';
import SocialMediaIcon from '../SocialMediaIcon/SocialMediaIcon';
import SocialMediaIconProps from '../SocialMediaIcon/types';
import { useAmplitudeExperiment } from '../../context/AmplitudeExperiment/hooks';
import { AmplitudeExperimentFlags } from '../../utils/amplitude/AmplitudeExperimentFlags';
import { ZENDESK_V1_BLC_UK_URL } from '@/root/global-vars';

/**
 ** Modular Footer component
 ** @TODO Footer tokens need to be white labeled
 ** @returns
 **/
const Footer: FC<FooterProps> = ({
  copyrightText,
  loginForm,
  navigationItems,
  socialLinks,
  downloadLinks,
  loggedIn,
}) => {
  const horizPadding = 'mobile:px-4 laptop:px-0 laptop:container laptop:mx-auto';

  // Calling amplitude experiment to check if zendesk is enabled
  const zendeskExperiment = useAmplitudeExperiment(
    AmplitudeExperimentFlags.ZENDESK_V1_BLCUK,
    'off'
  );

  const isZendeskV1BlcUkEnabled = zendeskExperiment.data?.variantName === 'on';

  return (
    <div className="bg-components-footer-primary w-full text-white" data-testid="app-footer">
      {/* Main body */}
      {((navigationItems && navigationItems.length > 0) || loginForm) && (
        <div
          className={`${horizPadding} py-8 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-4`}
        >
          {loginForm}
          {((navigationItems && navigationItems.length > 0) || loginForm) &&
            navigationItems
              .filter((navItem) => navItem.requiresLogin === loggedIn || !navItem.requiresLogin)
              .map((section: FooterNavigationSection, index) => {
                return (
                  <div key={index} className="p-2 flex flex-col space-y-2 grow">
                    <h1 className="text-3xl font-semibold">{section.title}</h1>
                    {section.navLinks.map((navLink: FooterNavigationLink, navLinkIndex) => {
                      if (navLink.label === 'Contact Us') {
                        return (
                          <Link
                            key={navLinkIndex}
                            href={isZendeskV1BlcUkEnabled ? ZENDESK_V1_BLC_UK_URL : navLink.url}
                            data-testid={navLink.label + '-link'}
                            className="text-components-footer-text hover:opacity-100 hover:underline"
                          >
                            {navLink.label}
                          </Link>
                        );
                      }
                      return (
                        <Link
                          key={navLinkIndex}
                          href={navLink.url}
                          data-testid={navLink.label + '-link'}
                          className="text-components-footer-text hover:opacity-100 hover:underline"
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
      {/* Socials and mobile download section */}
      {(socialLinks || downloadLinks) && (
        <div className="bg-components-footer-secondary">
          <div
            className={`${horizPadding} py-6 w-full grid grid-cols-1 tablet:grid-cols-2 space-y-2 tablet:space-y-0`}
          >
            {socialLinks && (
              <div className="flex flex-row m-auto tablet:mx-0 space-x-2">
                <p className="tablet:block hidden h-fit my-auto">Follow us:</p>
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

            {downloadLinks && (
              <div className="m-auto tablet:mx-0 flex flex-row justify-center space-x-2">
                <p className="tablet:inline-block hidden h-fit my-auto">Download our apps:</p>
                {downloadLinks.map((link: downloadLink, index) => {
                  return (
                    <div
                      key={index}
                      className="relative w-[80px] mobile:w-[100px] mobile-xl:w-[150px] h-[50px] my-2"
                    >
                      <Link
                        className="flex object-contain absolute top-0 left-0 w-full h-full"
                        href={link.downloadUrl}
                        title={link.linkTitle}
                        data-testid={link.linkTitle + '-link'}
                      >
                        <Image
                          alt={link.linkTitle || ''}
                          src={link.imageUrl}
                          responsive={true}
                          className="object-contain object-center"
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Copyright */}
      {copyrightText && (
        <div className="p-2 w-full bg-components-footer-secondary text-center">
          <p>{copyrightText}</p>
        </div>
      )}
    </div>
  );
};

export default Footer;
