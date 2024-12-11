import { FC, useState } from 'react';
import AccountDrawer from '../../../AccountDrawer';
import useDrawer from '../../../Drawer/useDrawer';
import { IdVerificationMethod } from '../../IdVerificationTypes';
import useIdVerification from '../../useIdVerification';
import IdVerificationTitle from '../IdVerificationTitle';
import IdVerificationByMethodId from './IdVerificationOptionByMethodId';
import IdVerificationTag from '../IdVerificationTag';
import IdVerificationText from '../IdVerificationText';
import { idVerificationText } from '../../IdVerificationConfig';

const IdVerificationMethods: FC = () => {
  const { close } = useDrawer();
  const { methods, mandatory, setMethod, title } = useIdVerification();
  const [newSelection, setNewSelection] = useState<IdVerificationMethod | null>(null);

  const onClick = (newMethod?: IdVerificationMethod) => () => {
    setNewSelection(newMethod ?? null);
  };

  const onNext = () => {
    setMethod(newSelection);
  };

  return (
    <AccountDrawer
      title={title}
      primaryButtonLabel={'Next'}
      primaryButtonOnClick={onNext}
      secondaryButtonLabel={'Back'}
      secondaryButtonOnClick={close}
      isDisabled={!newSelection}
    >
      {mandatory ? (
        <>
          <IdVerificationTitle>Verification method</IdVerificationTitle>
          <IdVerificationText>{idVerificationText.intro.withSupporting}</IdVerificationText>
          <IdVerificationByMethodId id={mandatory} tag={<IdVerificationTag />} selected />
          <IdVerificationTitle hasTopPadding>Choose a supporting document</IdVerificationTitle>
        </>
      ) : (
        <>
          <IdVerificationTitle>Choose verification method</IdVerificationTitle>
          <IdVerificationText>{idVerificationText.intro.default}</IdVerificationText>
        </>
      )}

      <div className={'flex flex-col gap-3'}>
        {methods.map((id: IdVerificationMethod) => (
          <IdVerificationByMethodId
            key={id}
            id={id}
            selected={newSelection === id}
            onClick={onClick}
          />
        ))}
      </div>
    </AccountDrawer>
  );
};

export default IdVerificationMethods;
