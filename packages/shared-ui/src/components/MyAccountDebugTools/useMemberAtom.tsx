import { atom, useAtomValue, useSetAtom } from 'jotai';

const isDevelopment = ['local', 'staging', 'preview'].includes(process.env.NEXT_PUBLIC_ENV ?? '');

const initialAtom =
  isDevelopment && typeof localStorage !== 'undefined'
    ? localStorage.getItem('memberUuidAtom')
    : null;

export const memberUuidAtom = atom<string | null>(initialAtom);

const useMemberAtom = () => {
  const atomMemberUuid = useAtomValue(memberUuidAtom);
  const updateAtomValue = useSetAtom(memberUuidAtom);

  const setMemberUuidAtom = (memberUuid: string | null) => {
    if (!isDevelopment) return;
    localStorage.setItem('memberUuidAtom', memberUuid ?? '');
    updateAtomValue(memberUuid ?? null);
  };

  return { setMemberUuidAtom, atomMemberUuid };
};

export default useMemberAtom;
