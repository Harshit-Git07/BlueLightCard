export interface MemberApplicationQueryPayload {
  brand: string;
  memberUUID: string;
  applicationId: string | null;
}

export interface MemberApplicationUpdatePayload {
  addr1: string;
  addr2: string;
  city: string;
  postcode: string;
  country: string;
  start_time: string;
  eligibility_status: string;
  verification_method: string;
  id_s3_primary: string;
  id_s3_secondary: string;
  trusted_domain_email: string;
  new_card_reason: string | null;
  change_reason: string | null;
  change_firstname: string | null;
  change_surname: string | null;
  change_doc_type: string | null;
  rejection_reason: string | null;
}
