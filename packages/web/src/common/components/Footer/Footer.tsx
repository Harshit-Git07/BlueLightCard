import { FC } from 'react';
import { FooterNavigationLink, FooterNavigationSection, FooterProps, downloadLink } from './types';
import Link from 'next/link';
import Image from '../Image/Image';
import SocialMediaIcon from '../SocialMediaIcon/SocialMediaIcon';
import SocialMediaIconProps from '../SocialMediaIcon/types';

/**
 * Modular Footer component
 * @TODO Footer tokens need to be white labeled
 * @returns
 */
const Footer: FC<FooterProps> = ({
  copyrightText,
  loginForm,
  navigationItems,
  socialLinks,
  downloadLinks,
}) => {
  const horizPadding = 'mobile:px-8 tablet:px-32 laptop:px-64';

  return (
    <div className="w-full text-white">
      {/* Main body */}
      {((navigationItems && navigationItems.length > 0) || loginForm) && (
        <div
          className={`${horizPadding} flex-col tablet:flex-row py-8 w-full bg-components-footer-primary flex justify-between max-mobile:flex-col tablet:flex-wrap`}
        >
          {loginForm}
          {((navigationItems && navigationItems.length > 0) || loginForm) &&
            navigationItems.map((section: FooterNavigationSection, index) => {
              return (
                <div key={index} className="p-2 flex flex-col space-y-2 grow">
                  <h1 className="text-3xl font-semibold">{section.title}</h1>
                  {section.navLinks.map((navLink: FooterNavigationLink, navLinkIndex) => {
                    return (
                      <Link
                        key={navLinkIndex}
                        href={navLink.url}
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
        <div
          className={`${horizPadding} py-6 w-full bg-components-footer-secondary flex tablet:flex-row flex-col justify-between space-y-4 tablet:space-y-0`}
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
                  />
                );
              })}
            </div>
          )}

          {downloadLinks && (
            <div className="m-auto tablet:mx-0 flex flex-row space-x-2">
              <p className="tablet:inline-block hidden h-fit my-auto">Download:</p>
              {downloadLinks.map((link: downloadLink, index) => {
                return (
                  <div key={index} className="w-fit h-full my-auto">
                    <Link className="w-fit relative" href={link.downloadUrl} title={link.linkTitle}>
                      <Image
                        alt={link.linkTitle || ''}
                        src={link.imageUrl}
                        responsive={false}
                        width={136}
                        height={40}
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {/* Copyright */}
      {copyrightText && (
        <div className="p-2 w-full bg-components-footer-tertiary text-center">
          <p>{copyrightText}</p>
        </div>
      )}
    </div>
  );
};

export default Footer;
