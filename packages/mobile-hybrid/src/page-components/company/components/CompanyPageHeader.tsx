import { Button, Heading, ThemeVariant } from '@bluelightcard/shared-ui';
import { FC } from 'react';
import { companyDataAtom } from '../atoms';
import { useAtom } from 'jotai';
import InvokeNativeLifecycle from '@/invoke/lifecycle';

const lifecycleEvent = new InvokeNativeLifecycle();

const CompanyPageHeader: FC = () => {
  const [company] = useAtom(companyDataAtom);
  const companyName = company?.companyName;
  const backEvent = () => {
    try {
      lifecycleEvent.lifecycleEvent('onBackPressed');
    } catch (e) {
      console.error(e);
    }
  };
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
        {companyName}
      </Heading>
      {/* TODO: Removed till we find a solution for the share button on mobile */}
      {/* <ShareButton
        shareDetails={{ name: companyName, description: '', url: '' }}
        showShareLabel={false}
      /> */}
    </div>
  );
};

export default CompanyPageHeader;
