import Button from '../Button-V2';
import { MarketingPreferencesInput } from './MarketingPreferencesInput';
import { SyntheticEvent } from 'react';
import { MarketingPreferencesData, preferenceDefinitions } from './MarketingPreferencesTypes';
import { colours, fonts } from '../../tailwind/theme';
import useMarketingPreferencesState from './useMarketingPreferencesState';
import Toast from '../Toast';
import { ToastPosition, ToastStatus } from '../Toast/ToastTypes';
import useToaster from '../Toast/Toaster/useToaster';

interface MarketingPreferencesProps {
  memberUuid: string;
}

const MarketingPreferences = ({ memberUuid }: MarketingPreferencesProps) => {
  const { openToast } = useToaster();
  const { preferences, isLoading, isBusy, savePreferences, togglePreference, hasChanged } =
    useMarketingPreferencesState(memberUuid);
  const onChange = (id: keyof MarketingPreferencesData) => () => {
    togglePreference(id);
  };

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (isBusy) return;
    const success = await savePreferences();
    if (success) {
      openToast(
        <Toast
          status={ToastStatus.Success}
          title={'Saved contact preferences'}
          text={'All your changes have been updated'}
        />,
        { position: ToastPosition.TopRight },
      );
    } else {
      openToast(
        <Toast
          status={ToastStatus.Error}
          title={'Unable to update contact preferences'}
          text={'Your changes could not be saved for some reason. Try again later'}
        />,
        { position: ToastPosition.TopRight },
      );
    }
  };

  const disabled = isLoading || isBusy || !hasChanged;

  const prefKeys = Object.keys(preferenceDefinitions) as (keyof MarketingPreferencesData)[];

  return (
    <form onSubmit={onSubmit} data-loading={isLoading}>
      {prefKeys.map((id) => (
        <MarketingPreferencesInput
          key={id}
          icon={preferenceDefinitions[id].icon}
          title={preferenceDefinitions[id].title}
          id={id}
          onChange={onChange(id)}
          isChecked={preferences[id]}
        >
          <span className={`${fonts.bodySmall} ${colours.textOnSurfaceSubtle}`}>
            {preferenceDefinitions[id].description}
          </span>
        </MarketingPreferencesInput>
      ))}
      <div className={'flex tablet:justify-end w-full'}>
        <div className={'w-full tablet:w-[90px] tablet:flex justify-center'}>
          <Button type={'submit'} disabled={disabled} className={'w-full'}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MarketingPreferences;
