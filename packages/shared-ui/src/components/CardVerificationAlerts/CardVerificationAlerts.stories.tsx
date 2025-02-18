import { Meta, StoryFn } from '@storybook/react';
import CardVerificationBanner from '.';
import { PlatformAdapterProvider, storybookPlatformAdapter } from '../../adapters';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import {
  allowedApplicationReasonValues,
  allowedEligibilityStatusValues,
  allowedRejectionReasonValues,
  allowedVerificationStatusValues,
  ApplicationReasonSchema,
  EligibilityStatusSchema,
  ProfileSchema,
  RejectionReasonSchema,
  VerificationStatusSchema,
} from './types';
import { defaultApplication, defaultProfile } from './testData';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';

const testClient = new QueryClient();

type WrapperProps = {
  applicationReason: ApplicationReasonSchema;
  eligibilityStatus: EligibilityStatusSchema;
  verificationMethod: VerificationStatusSchema;
  rejectionReason: RejectionReasonSchema;
};
const Wrapper: FC<WrapperProps> = (props) => {
  const responseBody: ProfileSchema = {
    ...defaultProfile,
    applications: [
      {
        ...defaultApplication,
        ...props,
      },
    ],
  };

  const adapter = {
    ...storybookPlatformAdapter,
  };
  adapter.invokeV5Api = async () => {
    return Promise.resolve({ status: 200, data: JSON.stringify(responseBody) });
  };

  useEffect(() => {
    testClient.invalidateQueries({ queryKey: ['members/profiles'] });
  }, [props]);

  return (
    <PlatformAdapterProvider adapter={adapter}>
      <QueryClientProvider client={testClient}>
        <CardVerificationBanner />
        <section className="h-screen flex items-center justify-center">
          <p>Stuff on the page</p>
        </section>
      </QueryClientProvider>
    </PlatformAdapterProvider>
  );
};

const componentMeta: Meta<typeof Wrapper> = {
  title: 'Component System/Verification Alert',
  component: Wrapper,
  argTypes: {
    applicationReason: {
      control: 'select',
      options: allowedApplicationReasonValues,
    },
    eligibilityStatus: {
      control: 'select',
      options: allowedEligibilityStatusValues,
    },
    verificationMethod: {
      control: 'select',
      options: allowedVerificationStatusValues,
    },
    rejectionReason: {
      control: 'select',
      options: allowedRejectionReasonValues,
    },
  },
};

const DefaultTemplate: StoryFn<typeof Wrapper> = (args) => <Wrapper {...args} />;

export const Default = DefaultTemplate.bind({});
Default.args = {
  applicationReason: ApplicationReason.SIGNUP,
  eligibilityStatus: EligibilityStatus.INELIGIBLE,
  verificationMethod: 'other',
  rejectionReason: undefined,
};

export default componentMeta;
