import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import Tag from '../../../Tag';
import React, { FC } from 'react';

interface IdVerificationTagProps {
  isSupporting?: boolean;
}

const IdVerificationTag: FC<IdVerificationTagProps> = ({ isSupporting = false }) => {
  const infoMessage = isSupporting ? 'Supporting document' : 'Primary document';
  return <Tag infoMessage={infoMessage} state={'Info'} iconLeft={faInfoCircle} />;
};

export default IdVerificationTag;
