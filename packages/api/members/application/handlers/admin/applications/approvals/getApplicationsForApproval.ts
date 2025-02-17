import { ApplicationService } from '@blc-mono/members/application/services/applicationService';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { ApplicationBatchModel } from '@blc-mono/shared/models/members/applicationApprovalModel';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

const service = new ApplicationService();

const unwrappedHandler = async (): Promise<ApplicationBatchModel[]> => {
  const applications = await service.searchApplications({
    eligibilityStatus: EligibilityStatus.AWAITING_ID_APPROVAL,
    sort: 'asc',
  });

  return applications.map((application) => ApplicationBatchModel.parse(application));
};

export const handler = middleware(unwrappedHandler);
