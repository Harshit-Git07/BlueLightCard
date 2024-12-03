import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Button,
  getCompanyQuery,
  Heading,
  ShareButton,
  ThemeVariant,
} from '@bluelightcard/shared-ui';
import InvokeNativeLifecycle from '@/invoke/lifecycle';
import { useCmsEnabled } from '@/hooks/useCmsEnabled';

const brandUrl = process.env.NEXT_PUBLIC_BRAND_URL;
const lifecycleEvent = new InvokeNativeLifecycle();

const backEvent = () => {
  try {
    lifecycleEvent.lifecycleEvent('onBackPressed');
  } catch (e) {
    console.error(e);
  }
};

const CompanyPageHeader = ({ companyId }: { companyId: string }) => {
  const cmsEnabled = useCmsEnabled();
  const { name, description } = useSuspenseQuery(getCompanyQuery(companyId, cmsEnabled)).data;

  return (
    <div className="py-2 flex flex-row justify-between items-center">
      <Button
        onClick={backEvent}
        className="text-primary-dukeblue-700 !px-0 !py-0"
        type="button"
        variant={ThemeVariant.Tertiary}
        borderless={true}
      >
        Back
      </Button>
      <Heading
        headingLevel={'h2'}
        className="!text-colour-onSurface dark:!text-colour-onSurface-dark !font-typography-title-medium-semibold !font-typography-title-medium-semibold-weight !text-typography-title-medium-semibold !tracking-typography-title-medium-semibold w-full !leading-typography-title-medium-semibold text-center w-full text-center !mb-0"
      >
        {name}
      </Heading>
      <ShareButton
        shareDetails={{
          name,
          description,
          url: `https://${brandUrl}/company?cid=${companyId}`,
        }}
        showShareLabel={false}
      />
    </div>
  );
};

export default CompanyPageHeader;
