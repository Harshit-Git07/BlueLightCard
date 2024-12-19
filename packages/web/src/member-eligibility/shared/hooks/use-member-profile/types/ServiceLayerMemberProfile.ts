import { components } from '@bluelightcard/shared-ui/generated/MembersApi';

export type ServiceLayerMemberProfile = components['schemas']['ProfileModel'];
export type ServiceLayerApplication = components['schemas']['ApplicationModel'];
export type ServiceLayerMemberProfileCard = ServiceLayerMemberProfile['cards'][number];
