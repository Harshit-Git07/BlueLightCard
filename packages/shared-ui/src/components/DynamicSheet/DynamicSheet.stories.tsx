import { Meta, StoryFn } from '@storybook/react';
import DynamicSheet from '.';
import { PlatformVariant } from '../../types';
import Heading from '../Heading';
import { useSetAtom } from 'jotai';
import { offerSheetAtom } from '../OfferSheet/store';
import { useEffect } from 'react';

const componentMeta: Meta<typeof DynamicSheet> = {
  title: 'Component System/Dynamic Sheet',
  component: DynamicSheet,
};

const DefaultTemplate: StoryFn<typeof DynamicSheet> = (args) => {
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);
  useEffect(() => {
    setOfferSheetAtom((prev) => ({ ...prev, isOpen: true, onClose: () => {} }));
  }, [setOfferSheetAtom]);

  return (
    <div style={{ minHeight: 250 }}>
      <DynamicSheet {...args}>
        <div>
          <Heading headingLevel="h1" className="text-black">
            Dynamic sheet heading
          </Heading>
          <p>This is the content text for the dynamic sheet content</p>
        </div>
      </DynamicSheet>
    </div>
  );
};

export const DesktopDinamicSheet = DefaultTemplate.bind({});
DesktopDinamicSheet.args = {
  platform: PlatformVariant.Desktop,
  showCloseButton: true,
};

export const MobileDinamicSheet = DefaultTemplate.bind({});
MobileDinamicSheet.args = {
  platform: PlatformVariant.Mobile,
  showCloseButton: true,
  height: '80%',
};

export default componentMeta;
