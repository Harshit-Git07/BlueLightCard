import { DDS_UK } from '@blc-mono/offers/src/utils/global-constants';

export function generateConstructId(id: string, stackName: string) {
  return stackName.includes(DDS_UK) ? `${DDS_UK}-${id}` : id;
}
