import {
  APPLICATION,
  CARD,
  NOTE,
  PROFILE,
} from '@blc-mono/members/application/repositories/repository';

export type StreamRecordTypes = 'Profile' | 'Application' | 'Card' | 'Note';

export function getStreamRecordType(sortKey: string): StreamRecordTypes {
  if (sortKey.startsWith(PROFILE)) {
    return 'Profile';
  }
  if (sortKey.startsWith(APPLICATION)) {
    return 'Application';
  }
  if (sortKey.startsWith(CARD)) {
    return 'Card';
  }
  if (sortKey.startsWith(NOTE)) {
    return 'Note';
  }

  throw new Error(`Unknown sortKey prefix: '${sortKey}'`);
}
