import { usePlatformAdapter } from '../../adapters';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import ToggleInput from '../ToggleInput';
import Button from '../Button-V2';
import { mockApplication, mockCard, mockMemberProfileResponse } from './mocks/mockMemberProfileGet';
import useMemberCard from '../../hooks/useMemberCard';
import { ApplicationSchema, CardSchema } from '../CardVerificationAlerts/types';
import { setupMocks } from './mocks/setupMocks';
import StagingUsers from './StagingUsers';

const MyAccountDebugTools = () => {
  const memberId = 'member-uuid';
  const [overrides, setOverrides] = useState(false);
  const queryClient = useQueryClient();
  const adapter = usePlatformAdapter();
  const { insideReprintPeriod } = useMemberCard(memberId);

  useEffect(() => {
    if (!overrides) return;
    setupMocks(adapter, true);
    queryClient.invalidateQueries({ queryKey: ['memberProfile'] });
  }, [overrides]);

  const resetAndReload = async ({
    card = {},
    application = {},
  }: {
    card?: Partial<CardSchema> | null;
    application?: Partial<ApplicationSchema> | null;
  }) => {
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
  };

  const toggleReprint = () =>
    resetAndReload({
      card: {
        purchaseDate: insideReprintPeriod ? '2023-11-27T08:55:46.030Z' : new Date().toJSON(),
      },
    });

  const isAwaitingId = () =>
    resetAndReload({
      application: {
        applicationReason: 'SIGNUP',
        eligibilityStatus: 'INELIGIBLE',
        rejectionReason: undefined,
        paymentStatus: undefined,
      },
    });

  const isAwaitingIdApproval = () =>
    resetAndReload({
      application: {
        applicationReason: 'SIGNUP',
        eligibilityStatus: 'AWAITING_ID_APPROVAL',
        verificationMethod: 'something',
      },
    });

  const isAwaitingPayment = () =>
    resetAndReload({
      application: {
        applicationReason: 'SIGNUP',
        paymentStatus: 'AWAITING_PAYMENT',
        eligibilityStatus: 'ELIGIBLE',
      },
    });

  const isRejected = () =>
    resetAndReload({
      application: {
        ...mockApplication,
        applicationReason: 'SIGNUP',
        rejectionReason: 'BLURRY_IMAGE_DECLINE_ID',
        eligibilityStatus: 'INELIGIBLE',
      },
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

  return (
    <div className={'absolute left-4 bottom-4'}>
      <StagingUsers />

      <label className={'flex items-center py-1 gap-2'}>
        <ToggleInput onChange={() => setOverrides(!overrides)} selected={overrides} />
        Overrides?
      </label>

      {overrides ? (
        <div className={'inline-flex flex-col gap-1'}>
          <Button onClick={() => toggleReprint()}>
            {insideReprintPeriod ? 'Outside' : 'Inside'} free reprint period
          </Button>
          <Button onClick={() => isAwaitingId()}>isAwaitingId</Button>
          <Button onClick={() => isAwaitingIdApproval()}>isAwaitingIdApproval</Button>
          <Button onClick={() => isAwaitingPayment()}>isAwaitingPayment</Button>
          <Button onClick={() => isRejected()}>isRejected</Button>
          <Button onClick={() => hasNoCard()}>hasNoCard</Button>
          <Button onClick={() => hasNoCardNoApplication()}>hasNoCardNoApplication</Button>
        </div>
      ) : null}
    </div>
  );
};

export default MyAccountDebugTools;
