import { FC } from 'react';
import AccountDrawer from '../../../../AccountDrawer';
import IdVerificationTitle from '../IdVerificationTitle';
import IdVerificationDocumentOption from './IdVerificationDocumentOption';
import IdVerificationTag from '../IdVerificationTag';
import IdVerificationText from '../IdVerificationText';
import { idVerificationText } from '../../IdVerificationConfig';
import useRequestNewCard from '../../../useRequestNewCard';
import { useSetAtom } from 'jotai/index';
import { requestNewCardAtom } from '../../../requestNewCardAtom';
import IdOrgMethods from './IdOrgMethods';
import { SupportedDocument } from '../../../../../api/types';

const IdVerificationMethods: FC = () => {
  const { isPending, goBack, goNext, verificationMethod, documents, mandatory } =
    useRequestNewCard();
  const setAtom = useSetAtom(requestNewCardAtom);

  const onClick = (doc?: SupportedDocument) => {
    if (!doc) return;
    setAtom((prev) => ({ ...prev, verificationMethod: doc.idKey }));
  };

  const onSubmit = async () => {
    if (!verificationMethod) return;
    goNext();
  };

  return (
    <form onSubmit={onSubmit} className={'h-full'}>
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
          documents={documents ?? []}
          selectedIdKey={verificationMethod}
          onClick={onClick}
        />
      </AccountDrawer>
    </form>
  );
};

export default IdVerificationMethods;
