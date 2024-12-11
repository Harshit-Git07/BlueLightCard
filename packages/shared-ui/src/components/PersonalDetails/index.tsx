import { FC, FormEventHandler } from 'react';
import Heading from '../Heading';
import { copy } from './copy';
import { ThemeVariant } from '../../types';
import DatePicker from '../DatePicker';
import { PersonalDetailsFormState, usePersonalDetailsState } from './hooks/usePersonalDetailsState';
import { Dropdown, useCSSConditional, usePlatformAdapter } from '../..';
import { genderDropdownOptions, renderGenderValue } from './constants';
import { NameSection } from './components/NameSection';
import { EmailPasswordSection } from './components/EmailPasswordSection';
import { EmploymentSection } from './components/EmploymentSection';
import Button from '../Button-V2';
import { DropdownOption } from '../Dropdown/types';
import { faArrowUpRightFromSquare } from '@fortawesome/pro-solid-svg-icons';
import FieldLabel from '../FieldLabel';
import useMemberId from '../../hooks/useMemberId';
import { ProfileSchema } from '../CardVerificationAlerts/types';
import useMemberProfileGet from '../../hooks/useMemberProfileGet';
import { PhoneNumberRegionSection } from './components/PhoneNumberRegionSection';

export const zendeskUrl = '/tmp';

const PersonalDetails: FC = () => {
  return (
    <div className="flex flex-col gap-3">
      <Heading headingLevel={'h2'}>{copy.title}</Heading>
      {/*<p>{`${brand}`}</p>*/}
      <PersonalDetailsForm />
    </div>
  );
};

const PersonalDetailsForm: FC = () => {
  const memberId = useMemberId();
  const { isLoading } = useMemberProfileGet(memberId);
  const { formState, saveButtonDisabled, updateFormValue, makeApiRequest } =
    usePersonalDetailsState();

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const response = await makeApiRequest();
    if (!response) return;

    if (response.type === 'success') {
      handleSuccess();
    } else {
      response.errors?.forEach(handleError);
    }
  };

  const handleSuccess = () => {
    console.log('implement');
  };

  const handleError = () => {
    console.log('implement');
  };

  const onDateChange = (newDate?: Date) => updateFormValue('dateOfBirth', newDate);
  const onPhoneNumberChange = (phoneNumber: string) => updateFormValue('phoneNumber', phoneNumber);
  const onGenderChange = (gender: DropdownOption) =>
    updateFormValue('gender', gender.id as ProfileSchema['gender']);
  const onCountyChange = (county: DropdownOption) => updateFormValue('region', county.label);
  const onDivisionChange = (division: DropdownOption) => updateFormValue('divisionId', division.id);

  const loadingStyles = 'blur-[2px]';
  const formStyles = useCSSConditional({
    'flex flex-col gap-[32px]': true,
    [loadingStyles]: isLoading,
  });
  const buttonStyles = 'tablet:w-fit tablet:self-end';

  return (
    <form className={formStyles} name="PersonalDetails" onSubmit={onFormSubmit}>
      <FormFieldSet
        dateOfBirth={formState.dateOfBirth}
        onDateChange={onDateChange}
        gender={formState.gender}
        onGenderChange={onGenderChange}
        phoneNumber={formState.phoneNumber}
        onPhoneNumberChange={onPhoneNumberChange}
        region={formState.region}
        onCountyChange={onCountyChange}
        divisionId={formState.divisionId}
        onDivisionChange={onDivisionChange}
      />
      <Button size="Large" disabled={saveButtonDisabled} className={buttonStyles} type="submit">
        {copy.saveButtonText}
      </Button>
    </form>
  );
};

type FormFieldSetProps = {
  dateOfBirth: PersonalDetailsFormState['dateOfBirth'];
  onDateChange: (date?: Date) => void;
  gender: PersonalDetailsFormState['gender'];
  onGenderChange: (gender: DropdownOption) => void;
  phoneNumber: PersonalDetailsFormState['phoneNumber'];
  onPhoneNumberChange: (phoneNumber: string) => void;
  region: PersonalDetailsFormState['region'];
  onCountyChange: (county: DropdownOption) => void;
  divisionId: PersonalDetailsFormState['divisionId'];
  onDivisionChange: (division: DropdownOption) => void;
};

export const FormFieldSet: FC<FormFieldSetProps> = ({
  dateOfBirth,
  onDateChange,
  gender,
  onGenderChange,
  phoneNumber,
  onPhoneNumberChange,
  region,
  onCountyChange,
  divisionId,
  onDivisionChange,
}) => {
  const { platform } = usePlatformAdapter();

  const mobileRowStyles = (compact: boolean) => `flex flex-col ${compact ? 'gap-3' : 'gap-[24px]'}`;
  const laptopRowStyles =
    'tablet:grid tablet:grid-cols-2 tablet:auto-rows-auto tablet:gap-x-3 tablet:gap-y-2';
  const rowStyles = (compact: boolean) => `${mobileRowStyles(compact)} ${laptopRowStyles} *:w-full`;

  return (
    <div className={'flex flex-col gap-[24px]'}>
      <div className={rowStyles(true)}>
        <NameSection />
      </div>
      <div className={rowStyles(false)}>
        <DatePicker
          value={dateOfBirth.value}
          onChange={onDateChange}
          disabled={dateOfBirth.disabled}
          label={copy.dateOfBirthLabel}
          htmlFor={'idk'}
        />
        <Dropdown
          options={genderDropdownOptions}
          value={renderGenderValue(gender.value)}
          onChange={onGenderChange}
          isDisabled={gender.disabled}
          label={copy.gender.label}
          placeholder={copy.gender.placeholder}
        />
      </div>
      <div className={rowStyles(false)}>
        <EmailPasswordSection />
      </div>
      {platform === 'mobile-hybrid' ? (
        <div>
          <FieldLabel label={copy.biometrics.label} htmlFor={'idk'} />
          <Button
            className={'!justify-start !px-0'}
            variant={ThemeVariant.Tertiary}
            size="Small"
            iconRight={faArrowUpRightFromSquare}
          >
            {copy.biometrics.buttonText}
          </Button>
        </div>
      ) : null}
      <div className={rowStyles(false)}>
        <PhoneNumberRegionSection
          phoneNumber={phoneNumber}
          onPhoneNumberChange={onPhoneNumberChange}
          region={region}
          onRegionChange={onCountyChange}
        />
      </div>
      <div className={rowStyles(false)}>
        <EmploymentSection divisionId={divisionId} onDivisionChange={onDivisionChange} />
      </div>
    </div>
  );
};

export default PersonalDetails;
