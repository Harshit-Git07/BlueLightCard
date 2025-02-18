import useMemberAtom from './useMemberAtom';
import { ChangeEvent } from 'react';
import { colours } from '../../tailwind/theme';
import ToggleInput from '../ToggleInput';
/*
this component will stop being useful when login/auth and active user are properly connected and working
 */

const stagingUsers = {
  activeCard: [
    'd838d443-662e-4ae0-b2f9-da15a95249a3 (Henrik)',
    '658c5560-49a7-4383-a5ce-b26e46436fad',
    '3c00f49a-346e-4700-820e-0aeaa6038e88',
    '5ac83bef-3358-48d6-9e94-9f73bde2248d',
    'c6c4af72-c36f-4aa7-958d-24cbe0074ffa',
  ],
  expiredCard: [
    'b4487335-13ff-4d7b-87c5-0297f8d3fbae',
    '82ed322a-9ca0-454a-9d6d-f8a333f14f17',
    '1bdf09a4-c7ac-4547-b48f-fcd3f10d9596',
    'f962ee65-3f7b-495c-9e1e-db8c247c1ef6',
    'aedfffb7-8eaa-4962-bdd9-7e9239e50192',
  ],
  incompleteSignup: ['27881933-b020-4232-b20c-0c5ad59f2909'],
  rejected: ['cd35fa8d-0d1b-430b-beda-4a72225e23ef'],
  awaitingApproval: [
    '62b22127-df5e-4706-90f6-ff3d8ea40a3b',
    '7fab5891-ea0b-4685-8896-f9a4a955ff0a',
    'd9818578-95e1-4e34-996f-c533af93bb4c',
    '0291e6bd-9140-401f-872f-003e16ab7509',
    'f390a1ff-ecf0-4044-849c-b17a7d5905c2',
  ],
  awaitingPayment: ['8fc175dc-91af-4490-a4b8-2de8e0cfb39c'],
  noCardNoApplication: ['df54af39-de59-4662-9b66-c5e686bd6810'],
  noCard1Application: ['3bb47af3-5b86-485e-bc20-e29d53912cc9'],
  hasCardNoApplication: ['197d635a-5925-425d-966c-98ab53e6c320'],
  cardAnd1Application: ['aa1d72fd-3d9f-4bdf-80b9-567ab429753d'],
};

const StagingUsers = () => {
  const { atomMemberUuid, setMemberUuidAtom } = useMemberAtom();

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setMemberUuidAtom(value);
  };

  const onToggleChange = () => {
    if (atomMemberUuid) {
      setMemberUuidAtom(null);
    }
  };

  return (
    <label className="block">
      <span className="flex justify-between">
        Staging Users
        <label className={'flex items-center py-1 gap-2'}>
          <ToggleInput onChange={onToggleChange} selected={!!atomMemberUuid} />
          Assume User?
        </label>
      </span>
      <select
        value={atomMemberUuid ?? ''}
        onChange={onChange}
        className={`block border rounded rounded-[8px] ${colours.borderPrimary} px-2 py-1`}
      >
        <option key="select" value={''} disabled>
          Select a Staging Member to mimic
        </option>
        <option key="will" value={'56c292e4-a031-7027-0ccf-8c8cc152eb2d'}>
          Will Smith
        </option>
        {Object.entries(stagingUsers).map(([name, members]) => (
          <>
            <optgroup key={name} label={name}>
              {members.map((memberId) => (
                <option key={memberId} value={memberId.split(' ')[0]}>
                  {memberId}
                </option>
              ))}
            </optgroup>
          </>
        ))}
      </select>
    </label>
  );
};

export default StagingUsers;
