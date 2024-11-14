import { FC, useMemo } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';
import Tag from '@bluelightcard/shared-ui/components/Tag';
import { ListSelectorProps } from '@bluelightcard/shared-ui/components/ListSelector/types';
import { TagProps } from '@bluelightcard/shared-ui/components/Tag/types';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';

interface VerificationMethodDetails {
  firstVerificationMethod: Details;
  secondVerificationMethod?: Details;
}

type Details = Pick<ListSelectorProps, 'title' | 'description' | 'tag' | 'showTrailingIcon'>;

export function useVerificationMethodDetails(
  eligibilityDetails: EligibilityDetails
): VerificationMethodDetails {
  // TODO: This should come from the service layer, but for now it is stubbed out
  return {
    firstVerificationMethod: useFirstVerificationMethodDetails(eligibilityDetails),
    secondVerificationMethod: useSecondVerificationMethodDetails(eligibilityDetails),
  };
}

function useFirstVerificationMethodDetails(eligibilityDetails: EligibilityDetails): Details {
  const title = useMemo(() => {
    if (Array.isArray(eligibilityDetails.fileVerificationType)) {
      return eligibilityDetails.fileVerificationType[0];
    }

    return eligibilityDetails.fileVerificationType ?? 'Unknown verification method selected';
  }, [eligibilityDetails.fileVerificationType]);

  const description = useMemo(() => {
    if (title === 'Work Contract') {
      return (
        <>
          Must show NHS/HSC
          <br />
          Must show your full name
        </>
      );
    }

    return undefined;
  }, [title]);

  const tag = useMemo(() => {
    if (Array.isArray(eligibilityDetails.fileVerificationType)) {
      return <VerificationMethodDetailsTag infoMessage="Primary document" />;
    }

    return undefined;
  }, [eligibilityDetails.fileVerificationType]);

  const showTrailingIcon = useMemo(() => {
    return !Array.isArray(eligibilityDetails.fileVerificationType);
  }, [eligibilityDetails.fileVerificationType]);

  return {
    title,
    description,
    tag,
    showTrailingIcon,
  };
}

function useSecondVerificationMethodDetails(
  eligibilityDetails: EligibilityDetails
): Details | undefined {
  const title = useMemo(() => {
    if (
      !Array.isArray(eligibilityDetails.fileVerificationType) ||
      eligibilityDetails.fileVerificationType.length !== 2
    ) {
      return undefined;
    }

    return eligibilityDetails.fileVerificationType[1];
  }, [eligibilityDetails.fileVerificationType]);

  const description = useMemo(() => {
    if (title === 'Bank Statement') {
      return 'Must show the social care department within the council\nMust show your full name';
    }

    return undefined;
  }, [title]);

  const tag = useMemo(() => {
    if (Array.isArray(eligibilityDetails.fileVerificationType)) {
      return <VerificationMethodDetailsTag infoMessage="Supporting document" />;
    }

    return undefined;
  }, [eligibilityDetails.fileVerificationType]);

  if (!title) return undefined;

  return {
    title,
    description,
    tag,
  };
}

type VerificationMethodDetailsTagProps = Pick<TagProps, 'infoMessage'>;

const VerificationMethodDetailsTag: FC<VerificationMethodDetailsTagProps> = (props) => (
  <Tag {...props} state="Info" iconLeft={faCircleInfo} />
);
