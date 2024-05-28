import { Heading } from '@bluelightcard/shared-ui';
import { FC } from 'react';
import { companyDataAtom } from './atoms';
import { useAtom } from 'jotai';

const CompanyPageHeader: FC = () => {
  const [company] = useAtom(companyDataAtom);
  const companyName = company?.companyName;
  const backEvent = () => {
    try {
      window.history.back();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="py-2 flex flex-row justify-between">
      <button onClick={backEvent} className="text-primary-dukeblue-700">
        Back
      </button>
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
