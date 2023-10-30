import {z} from 'zod';
import { transformDateToFormatYYYYMMDD } from '../../../core/src/utils/date';

export const EcFormOutputDataModel = z.object({
    employer: z.string(),
    organisation: z.string(),
    employmentStatus: z.string(),
    jobRole: z.string(),
  });

(EcFormOutputDataModel as any)._ModelName = 'EcFormOutputDataModel'

export type EcFormOutputDataModel = z.infer<typeof EcFormOutputDataModel>;