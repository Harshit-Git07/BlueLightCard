import useMemberProfileGet from './useMemberProfileGet';

const useMemberId = () => {
  const { memberProfile } = useMemberProfileGet();
  return memberProfile?.memberId ?? '';
};

export default useMemberId;
