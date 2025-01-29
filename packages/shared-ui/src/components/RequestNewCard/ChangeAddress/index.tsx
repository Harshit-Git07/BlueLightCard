import AccountDrawer from '../../AccountDrawer';
import ChangeAddressFields from './ChangeAddressFields';
import { FC, useEffect, useState } from 'react';
import { drawerTitle, whereToSend } from '../requestNewCardConfig';
import IdVerificationTitle from '../IdVerification/components/IdVerificationTitle';
import useRequestNewCard from '../useRequestNewCard';
import { Address } from '../requestNewCardTypes';
import useMemberProfileGet from '../../../hooks/useMemberProfileGet';
import useMemberApplication from '../../../hooks/useMemberApplication';

const ChangeAddress: FC = () => {
  const { mutateMemberProfile, mutateAsync, isPending, goBack, goNext, memberId } =
    useRequestNewCard();
  const { memberProfile } = useMemberProfileGet(memberId);
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
    if (application) {
      setAddress((prevAddress) => ({
        ...prevAddress,
        address1: application.address1 ?? '',
        address2: application.address2 ?? '',
        city: application.city ?? '',
        postcode: application.postcode ?? '',
        country: application.country ?? '',
      }));
    }
    if (memberProfile) {
      setAddress((prevAddress) => ({
        ...prevAddress,
        county: memberProfile.county ?? '',
      }));
    }
  }, [application, memberProfile]);

  const onChange = (field: keyof Address, value: string) => {
    setAddress((prev: Address) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    await mutateMemberProfile({ county: address.county });
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
