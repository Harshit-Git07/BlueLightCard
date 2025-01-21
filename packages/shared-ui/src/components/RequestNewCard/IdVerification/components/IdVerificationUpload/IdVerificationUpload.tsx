'use client';

import AccountDrawer from '../../../../AccountDrawer';
import React, { FC, useRef, useState } from 'react';
import IdVerificationTitle from '../IdVerificationTitle';
import IdVerificationFileUploadInfoBox from './IdVerificationFileUploadInfoBox';
import IdVerificationTag from '../IdVerificationTag';

import { FileInfo, UploadStatus } from '../../../../FileUpload/types';
import { idVerificationText } from '../../IdVerificationConfig';
import useRequestNewCard from '../../../useRequestNewCard';
import FileUpload from './FileUpload';
import IdVerificationDocumentOption from '../IdVerificationMethods/IdVerificationDocumentOption';

const IdVerificationUpload: FC = () => {
  const documentIdsRef = useRef<string[]>([]);
  const {
    isPending,
    goBack,
    goNext,
    verificationMethod,
    mandatory,
    isDoubleId,
    supportingDocs,
    mutateAsync,
  } = useRequestNewCard();
  const [isValid, setIsValid] = useState(false);
  const expectedNumberOfUploads = isDoubleId ? 2 : 1;

  const onSubmit = async () => {
    await mutateAsync({ documents: documentIdsRef.current });
    goNext();
  };

  const onFilesChanged = (selectedFiles: FileInfo[]) => {
    const nSuccess = selectedFiles.filter((f) => f.uploadStatus === UploadStatus.Success).length;
    documentIdsRef.current = selectedFiles.map(({ documentId }) => documentId ?? '');
    setIsValid(nSuccess === expectedNumberOfUploads);
  };

  const selectedDoc = supportingDocs.find((doc) => doc.idKey === verificationMethod);

  return (
    <form onSubmit={onSubmit} className={'h-full'}>
      <AccountDrawer
        title={idVerificationText.title}
        primaryButtonLabel={'Next'}
        primaryButtonOnClick={onSubmit}
        secondaryButtonOnClick={goBack}
        secondaryButtonLabel={'Back'}
        isDisabled={!isValid || isPending}
      >
        <IdVerificationTitle>Verification method</IdVerificationTitle>

        <div className={'flex flex-col gap-[8px]'}>
          {mandatory ? (
            <IdVerificationDocumentOption
              doc={mandatory}
              tag={<IdVerificationTag />}
              onClick={goBack}
              isSelected
              descriptionOverride={mandatory.guidelines ?? mandatory.description}
            />
          ) : null}

          {selectedDoc ? (
            <IdVerificationDocumentOption
              doc={selectedDoc}
              tag={mandatory ? <IdVerificationTag isSupporting /> : null}
              onClick={goBack}
              isSelected
              showTrailingIcon
              descriptionOverride={selectedDoc.guidelines ?? selectedDoc.description}
            />
          ) : null}
        </div>

        <div className={'flex flex-col gap-[24px] pt-[24px] items-center'}>
          <FileUpload
            labelText={'Upload from your device or camera'}
            expectedNumberOfUploads={expectedNumberOfUploads}
            onChange={onFilesChanged}
          />
          <IdVerificationFileUploadInfoBox />
        </div>
      </AccountDrawer>
    </form>
  );
};

export default IdVerificationUpload;
