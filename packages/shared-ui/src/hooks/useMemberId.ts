// [TODO] this may not need to be a hook, but it's unclear at this time where this value is coming from
const useMemberId = () => {
  const mockMemberId = '';
  if (typeof localStorage === 'undefined') return mockMemberId;
  return localStorage.getItem('username') ?? mockMemberId;
};

export default useMemberId;
