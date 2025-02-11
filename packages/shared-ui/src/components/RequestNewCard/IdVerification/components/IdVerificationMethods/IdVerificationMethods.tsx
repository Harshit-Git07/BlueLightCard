import { FC, SyntheticEvent, useState } from 'react';
import AccountDrawer from '../../../../AccountDrawer';
import IdVerificationTitle from '../IdVerificationTitle';
import IdVerificationDocumentOption from './IdVerificationDocumentOption';
import IdVerificationTag from '../IdVerificationTag';
import IdVerificationText from '../IdVerificationText';
import { idVerificationText } from '../../IdVerificationConfig';
import useRequestNewCard from '../../../useRequestNewCard';
import IdOrgMethods from './IdOrgMethods';
import { SupportedDocument } from '../../../../../api/types';

const IdVerificationMethods: FC = () => {
  const { mutateAsync, isPending, goBack, goNext, supportingDocs, mandatory } = useRequestNewCard();
  const [verificationMethod, setVerificationMethod] = useState<string | undefined>(undefined);

  const onClick = (doc?: SupportedDocument) => {
    if (!doc) return;
    setVerificationMethod(doc.idKey);
  };

  const onSubmit = async () => {
    if (!verificationMethod) return;
    await mutateAsync({ verificationMethod });
    goNext();
  };

  const onFormSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={onFormSubmit} className={'h-full'}>
      <AccountDrawer
        title={idVerificationText.title}
        primaryButtonLabel={'Next'}
        primaryButtonOnClick={onSubmit}
        secondaryButtonLabel={'Back'}
        secondaryButtonOnClick={goBack}
        isDisabled={!verificationMethod || isPending}
      >
        {mandatory ? (
          <>
            <IdVerificationTitle>Verification method</IdVerificationTitle>
            <IdVerificationText>{idVerificationText.intro.withSupporting}</IdVerificationText>
            <IdVerificationDocumentOption doc={mandatory} tag={<IdVerificationTag />} isSelected />
            <IdVerificationTitle hasTopPadding>Choose a supporting document</IdVerificationTitle>
          </>
        ) : (
          <>
            <IdVerificationTitle>Choose verification method</IdVerificationTitle>
            <IdVerificationText>{idVerificationText.intro.default}</IdVerificationText>
          </>
        )}

        <IdOrgMethods
          documents={supportingDocs ?? []}
          selectedIdKey={verificationMethod}
          onClick={onClick}
        />
      </AccountDrawer>
    </form>
  );
};

export default IdVerificationMethods;
