import AccountDrawer from '../../AccountDrawer';
import ChangeAddressFields from './ChangeAddressFields';
import { FC, useEffect, useState } from 'react';
import { drawerTitle, whereToSend } from '../requestNewCardConfig';
import IdVerificationTitle from '../IdVerification/components/IdVerificationTitle';
import useRequestNewCard from '../useRequestNewCard';
import { Address } from '../requestNewCardTypes';
import useMemberApplication from '../useMemberApplication';

const ChangeAddress: FC = () => {
  const { mutateAsync, isPending, goBack, goNext, memberId } = useRequestNewCard();
  const { application } = useMemberApplication(memberId);
  const [hasError, setHasError] = useState(false);
  const [address, setAddress] = useState<Address>({
    address1: '',
    address2: '',
    city: '',
    county: '',
    postcode: '',
    country: '',
  });

  useEffect(() => {
    if (!application) return;
    setAddress({
      address1: application.address1 ?? '',
      address2: application.address2 ?? '',
      city: application.city ?? '',
      county: application.county ?? '',
      postcode: application.postcode ?? '',
      country: application.country ?? '',
    });
  }, [application]);

  const onChange = (field: keyof Address, value: string) => {
    setAddress((prev: Address) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    await mutateAsync(address);
    goNext();
  };

  return (
    <form onSubmit={onSubmit} className={'h-full'}>
      <AccountDrawer
        title={drawerTitle}
        primaryButtonLabel={'Next'}
        primaryButtonOnClick={onSubmit}
        secondaryButtonLabel={'Back'}
        secondaryButtonOnClick={goBack}
        isDisabled={isPending || hasError}
      >
        <IdVerificationTitle>{whereToSend}</IdVerificationTitle>
        <ChangeAddressFields address={address} onChange={onChange} setHasErrors={setHasError} />
      </AccountDrawer>
    </form>
  );
};

export default ChangeAddress;
