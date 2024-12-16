import { usePlatformAdapter } from '../../adapters';
import { useQueryClient } from '@tanstack/react-query';
import { setupMocks } from './mocks/setupMocks';
import React, { useEffect, useState } from 'react';
import ToggleInput from '../ToggleInput';
import Button from '../Button-V2';
import { mockApplication, mockMemberProfileResponse } from './mocks/mockMemberProfileGet';
import useMemberCard from '../../hooks/useMemberCard';
import { ApplicationSchema } from '../CardVerificationAlerts/types';

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

  const onBecomeStagingUser = () => {
    localStorage.setItem('username', 'd838d443-662e-4ae0-b2f9-da15a95249a3');
    window.location.reload();
  };

  const toggleReprint = async () => {
    mockMemberProfileResponse.cards[0].purchaseDate = insideReprintPeriod
      ? '2023-11-27T08:55:46.030Z'
      : new Date().toJSON();
    await queryClient.invalidateQueries({ queryKey: ['memberProfile'] });
  };

  const isAwaitingId = async () => {
    const newApplication: ApplicationSchema = {
      ...mockApplication,
      applicationReason: 'SIGNUP',
      eligibilityStatus: 'INELIGIBLE',
      rejectionReason: undefined,
      paymentStatus: undefined,
    };
    mockMemberProfileResponse.applications = [newApplication];
    await queryClient.invalidateQueries({ queryKey: ['memberProfile'] });
  };

  const isAwaitingIdApproval = async () => {
    const newApplication: ApplicationSchema = {
      ...mockApplication,
      applicationReason: 'SIGNUP',
      eligibilityStatus: 'AWAITING_ID_APPROVAL',
      verificationMethod: 'something',
    };
    mockMemberProfileResponse.applications = [newApplication];
    await queryClient.invalidateQueries({ queryKey: ['memberProfile'] });
  };

  const isAwaitingPayment = async () => {
    const newApplication: ApplicationSchema = {
      ...mockApplication,
      applicationReason: 'SIGNUP',
      paymentStatus: 'AWAITING_PAYMENT',
      eligibilityStatus: 'ELIGIBLE',
    };
    mockMemberProfileResponse.applications = [newApplication];
    await queryClient.invalidateQueries({ queryKey: ['memberProfile'] });
  };

  const isRejected = async () => {
    const newApplication: ApplicationSchema = {
      ...mockApplication,
      applicationReason: 'SIGNUP',
      rejectionReason: 'BLURRY_IMAGE_DECLINE_ID',
      eligibilityStatus: 'INELIGIBLE',
    };
    mockMemberProfileResponse.applications = [newApplication];
    await queryClient.invalidateQueries({ queryKey: ['memberProfile'] });
  };

  return (
    <div className={'absolute left-4 bottom-4'}>
      <Button onClick={onBecomeStagingUser}>Become staging user</Button>

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
        </div>
      ) : null}
    </div>
  );
};

export default MyAccountDebugTools;
