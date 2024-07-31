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
    <div className="py-2 flex flex-row justify-between">
      <Button
        onClick={backEvent}
        className="text-primary-dukeblue-700"
        type="button"
        variant={ThemeVariant.Tertiary}
      >
        Back
      </Button>
      <Heading headingLevel={'h2'} className="text-black w-full text-center">
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
