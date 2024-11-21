import AccountDrawer from '../../../AccountDrawer';
import React, { FC, SyntheticEvent, useState } from 'react';
import { colours } from '../../../../tailwind/theme';
import FileUpload from './FileUpload';
import useIdVerification from '../../useIdVerification';
import IdVerificationTitle from '../IdVerificationTitle';
import IdVerificationFileUploadInfoBox from './IdVerificationFileUploadInfoBox';
import IdVerificationTag from '../IdVerificationTag';
import { IdVerificationMethod } from '../../IdVerificationTypes';
import IdVerificationOptionByMethodId from '../IdVerificationMethods/IdVerificationOptionByMethodId';
import { FileInfo, UploadStatus } from '../../../FileUpload/types';

const IdVerificationUpload: FC = () => {
  const { resetVerification, selectedMethod, mandatory, title, isDoubleId } = useIdVerification();
  const [isValid, setIsValid] = useState(false);
  const expectedNumberOfUploads = isDoubleId ? 2 : 1;

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  const onFilesChanged = (selectedFiles: FileInfo[]) => {
    const nSuccess = selectedFiles.filter((f) => f.uploadStatus === UploadStatus.Success).length;
    setIsValid(nSuccess === expectedNumberOfUploads);
  };

  return (
    <form onSubmit={onSubmit} className={'h-full'}>
      <AccountDrawer
        title={title}
        primaryButtonLabel={'Next'}
        primaryButtonOnClick={() => {}}
        secondaryButtonOnClick={resetVerification}
        secondaryButtonLabel={'Back'}
        isDisabled={!isValid}
      >
        <IdVerificationTitle>Verification method</IdVerificationTitle>

        {mandatory ? (
          <IdVerificationOptionByMethodId
            id={mandatory}
            tag={<IdVerificationTag />}
            onClick={() => resetVerification}
            selected
            showDetail
          />
        ) : null}

        <div className={'pt-3'}>
          <IdVerificationOptionByMethodId
            id={selectedMethod as IdVerificationMethod}
            tag={mandatory ? <IdVerificationTag isSupporting /> : null}
            onClick={() => resetVerification}
            selected
            showTrailingIcon
            showDetail
          />
        </div>

        <hr className={`my-[32px] ${colours.backgroundOnSurfaceOutline}`} />

        <div className={'flex flex-col gap-[24px] items-center'}>
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
