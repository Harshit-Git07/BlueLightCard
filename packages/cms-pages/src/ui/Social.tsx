import { getSite } from '@/lib/sanity/queries';
import CTA from './CTA';
import { cn } from '@/lib/utils';

import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { IoIosLink } from 'react-icons/io';
import { getBrand } from '@/app/actions';
import { IconBaseProps } from 'react-icons';

export default async function Social({ className }: React.HTMLProps<HTMLDivElement>) {
  const selectedBrand = await getBrand();
  const { social } = await getSite(selectedBrand);

  if (!social?.items?.length) return null;

  return (
    <nav className={cn('group flex flex-wrap items-center', className)}>
      {social.items.map((item, key) => {
        switch (item._type) {
          case 'link':
            return (
              <CTA
                className="px-2 hover:!opacity-100 group-has-[a:hover]:opacity-50"
                link={item}
                key={key}
              >
                <Icon url={item.external} aria-label={item.label} />
              </CTA>
            );

          default:
            return null;
        }
      })}
    </nav>
  );
}

function Icon({ url, ...props }: { url?: string } & React.HTMLProps<SVGElement>) {
  if (!url) return null;

  const iconProps: IconBaseProps = {
    size: props.size,
    color: props.color,
    title: props.title,
  };

  return url?.includes('facebook.com') ? (
    <FaFacebookF {...iconProps} />
  ) : url?.includes('github.com') ? (
    <FaGithub {...iconProps} />
  ) : url?.includes('instagram.com') ? (
    <FaInstagram {...iconProps} />
  ) : url?.includes('linkedin.com') ? (
    <FaLinkedinIn {...iconProps} />
  ) : url?.includes('tiktok.com') ? (
    <FaTiktok {...iconProps} />
  ) : url?.includes('twitter.com') || url?.includes('x.com') ? (
    <FaXTwitter {...iconProps} />
  ) : url?.includes('youtube.com') ? (
    <FaYoutube {...iconProps} />
  ) : (
    <IoIosLink {...iconProps} />
  );
}
