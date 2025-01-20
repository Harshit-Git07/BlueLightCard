import { middleware } from '../../../../middleware';
import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { EligibilityStatus } from '@blc-mono/members/application/models/enums/EligibilityStatus';
import { ApplicationBatchModel } from '@blc-mono/members/application/models/applicationApprovalModel';

const service = new ApplicationService();

const unwrappedHandler = async (): Promise<ApplicationBatchModel[]> => {
  const applications = await service.searchApplications({
    eligibilityStatus: EligibilityStatus.AWAITING_ID_APPROVAL,
    sort: 'asc',
  });

  return applications.map((application) => ApplicationBatchModel.parse(application));
};

export const handler = middleware(unwrappedHandler);
