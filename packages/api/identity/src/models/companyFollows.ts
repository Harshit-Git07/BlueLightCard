import {z} from 'zod';

export const CompanyFollowsModel = z.object({
    sk: z.string(),
    likeType: z.string()
}).transform(companyFollows => ({
    companyId: companyFollows.sk.replace('COMPANYFOLLOWS#', ''),
    likeType: companyFollows.likeType,
}));

(CompanyFollowsModel as any)._ModelName = 'CompanyFollowsModel'

export type CompanyFollowsModel = z.infer<typeof CompanyFollowsModel>;