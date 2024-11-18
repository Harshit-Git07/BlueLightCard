export interface ServiceLayerEmployer {
  employerId: string; // UUID
  name: string;
  active?: boolean; // Default to `true`
  retired?: boolean; // Default to `false`
  volunteers?: boolean; // Default to `false`
  trustedDomains?: string[];
  type?: unknown; // This is just defined as `{}` on the docs
  idRequirements?: IdRequirements[];
}

interface IdRequirements {
  id: string;
  description?: string;
  title?: string;
  allowedFormats?: string;
  criteria?: string[];
}
