import { ENVIRONMENT } from '@/root/global-vars';
import { ShareButton, Heading } from '@bluelightcard/shared-ui/index';
import Link from 'next/link';

type Props = {
  isMobile: boolean;
  companyId: string;
  companyName?: string;
  companyDescription?: string;
  companySharedEvent: () => void;
};

const CompanyPageWebHeader = (props: Props) => {
  return (
    <div className="flex justify-between desktop:items-start mobile:items-center">
      {props.isMobile && <Link href="/members-home">Back</Link>}
      <Heading
        headingLevel={'h1'}
        className="!text-colour-onSurface dark:!text-colour-onSurface-dark !font-typography-title-medium-semibold !font-typography-title-medium-semibold-weight !text-typography-title-medium-semibold !tracking-typography-title-medium-semibold !leading-typography-title-medium-semibold 
                        tablet:!text-colour-greyscale-onSurface tablet:!font-typography-display-small tablet:!font-typography-display-small-weight tablet:!text-typography-display-small tablet:!tracking-typography-display-small tablet:!leading-typography-display-small"
      >
        {props.companyName}
      </Heading>
      <div
        className="flex desktop:justify-end desktop:items-start mobile:gap-2"
        onClick={props.companySharedEvent}
      >
        <ShareButton
          showShareLabel={!props.isMobile}
          shareDetails={{
            name: props.companyName,
            description: props.companyDescription,
            // adds check on ENVIRONMENT so we can pass the port on localhost:3000 for the share URL. Otherwise it will not show port in the url
            url: `${window.location.protocol}//${window.location.hostname}${
              ENVIRONMENT === 'local' && window.location.port ? `:${window.location.port}` : ''
            }/company?cid=${props.companyId}`,
          }}
        />
      </div>
    </div>
  );
};

export default CompanyPageWebHeader;
