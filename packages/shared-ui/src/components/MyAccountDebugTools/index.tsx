import { usePlatformAdapter } from '../../adapters';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import ToggleInput from '../ToggleInput';
import Button from '../Button-V2';
import { mockApplication, mockCard, mockMemberProfileResponse } from './mocks/mockMemberProfileGet';
import { ApplicationSchema, CardSchema, ProfileSchema } from '../CardVerificationAlerts/types';
import { setupMocks } from './mocks/setupMocks';
import StagingUsers from './StagingUsers';
import { ApplicationReason } from '@blc-mono/shared/models/members/enums/ApplicationReason';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { RejectionReason } from '@blc-mono/shared/models/members/enums/RejectionReason';
import { useSetAtom } from 'jotai';
import {
  initializeRequestNewCardAtom,
  requestNewCardAtom,
} from '../RequestNewCard/requestNewCardAtom';
import { RequestNewCardAtom } from '../RequestNewCard/requestNewCardTypes';
import { colours } from '../../tailwind/theme';
import { useOverrideStripe } from './useOverrideStripe';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';

const MyAccountDebugTools = () => {
  const [overrides, setOverrides] = useState(false);
  const [stripeWillSucceed, setStripeWillSucceed] = useState(true);
  const queryClient = useQueryClient();
  const adapter = usePlatformAdapter();
  const setAtom = useSetAtom(requestNewCardAtom);

  useOverrideStripe(overrides, stripeWillSucceed);

  useEffect(() => {
    if (!overrides) return;
    setupMocks(adapter);
    queryClient.invalidateQueries({ queryKey: ['memberProfile'] });
  }, [overrides]);

  const resetAndReload = async ({
    card = {},
    application = {},
    atom,
    employmentStatus = EmploymentStatus.EMPLOYED,
    paymentWillSucceed = true,
  }: {
    card?: Partial<CardSchema> | null;
    application?: Partial<ApplicationSchema> | null;
    atom?: Partial<RequestNewCardAtom>;
    employmentStatus?: ProfileSchema['employmentStatus'];
    paymentWillSucceed?: boolean;
  }) => {
    setupMocks(adapter);
    setStripeWillSucceed(paymentWillSucceed);
    setAtom((prev) => (atom ? { ...prev, ...atom } : initializeRequestNewCardAtom()));
    mockMemberProfileResponse.employmentStatus = employmentStatus;
    mockMemberProfileResponse.cards =
      card === null
        ? []
        : [
            {
              ...mockCard,
              ...card,
            },
          ];
    mockMemberProfileResponse.applications =
      application === null
        ? []
        : [
            {
              ...mockApplication,
              ...application,
            },
          ];
    await queryClient.invalidateQueries({ queryKey: ['memberProfile'] });
    await queryClient.invalidateQueries({ queryKey: ['/members/orgs'] });
  };

  const isAwaitingId = () =>
    resetAndReload({
      application: {
        applicationReason: ApplicationReason.SIGNUP,
        eligibilityStatus: EligibilityStatus.INELIGIBLE,
        rejectionReason: undefined,
        paymentStatus: undefined,
      },
    });

  const isAwaitingIdApproval = () =>
    resetAndReload({
      application: {
        applicationReason: ApplicationReason.SIGNUP,
        eligibilityStatus: EligibilityStatus.AWAITING_ID_APPROVAL,
        verificationMethod: 'something',
      },
    });

  const isAwaitingPayment = () =>
    resetAndReload({
      application: {
        applicationReason: ApplicationReason.SIGNUP,
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
        paymentStatus: PaymentStatus.AWAITING_PAYMENT,
      },
    });

  const isRejected = () =>
    resetAndReload({
      application: {
        ...mockApplication,
        applicationReason: ApplicationReason.SIGNUP,
        eligibilityStatus: EligibilityStatus.INELIGIBLE,
        rejectionReason: RejectionReason.BLURRY_IMAGE_DECLINE_ID,
      },
    });

  const hasCardNoApplication = () =>
    resetAndReload({
      application: null,
    });

  const hasNoCard = () =>
    resetAndReload({
      card: null,
    });

  const hasNoCardNoApplication = () =>
    resetAndReload({
      card: null,
      application: null,
    });

  const freeReprint = () =>
    resetAndReload({
      card: {
        purchaseDate: new Date().toJSON(),
      },
      application: null,
    });

  const requiresDoubleId = () =>
    resetAndReload({
      application: null,
      employmentStatus: EmploymentStatus.RETIRED,
    });

  const idRejected = () =>
    resetAndReload({
      application: {
        ...mockApplication,
        applicationReason: ApplicationReason.LOST_CARD,
        rejectionReason: RejectionReason.BLURRY_IMAGE_DECLINE_ID,
        eligibilityStatus: EligibilityStatus.INELIGIBLE,
      },
    });

  return (
    <div
      className={`absolute left-0 bottom-0 pb-4 bg-opacity-85 h-[56px] hover:h-auto z-[1000] ${colours.backgroundSurface} ${colours.borderPrimary} border rounded rounded-2`}
    >
      <h2 className={`bg-button-primary-default-bg-colour text-white p-4`}>
        My Account - mock tools
      </h2>
      <div className={'p-4'}>
        <StagingUsers />

        <label className={'flex items-center py-1 gap-2'}>
          <ToggleInput onChange={() => setOverrides(!overrides)} selected={overrides} />
          Overrides?
        </label>

        {overrides ? (
          <div className={'inline-flex flex-col gap-1'}>
            <h2 className={'pt-2'}>Card Verification Alerts</h2>
            <Button onClick={() => isAwaitingId()}>isAwaitingId</Button>
            <Button onClick={() => isAwaitingIdApproval()}>isAwaitingIdApproval</Button>
            <Button onClick={() => isAwaitingPayment()}>isAwaitingPayment</Button>
            <Button onClick={() => isRejected()}>isRejected</Button>
            <h2 className={'pt-2'}>Card Statuses</h2>
            <Button onClick={() => hasCardNoApplication()}>hasCardNoApplication</Button>
            <Button onClick={() => hasNoCard()}>hasNoCard</Button>
            <Button onClick={() => hasNoCardNoApplication()}>hasNoCardNoApplication</Button>
            <h2 className={'pt-2'}>Request new card</h2>
            <Button onClick={() => freeReprint()}>Start (Reprint)</Button>
            <Button onClick={() => hasCardNoApplication()}>Start</Button>
            <Button onClick={() => requiresDoubleId()}>Requires 2x IDs</Button>
            <Button onClick={() => idRejected()}>ID was rejected</Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyAccountDebugTools;
