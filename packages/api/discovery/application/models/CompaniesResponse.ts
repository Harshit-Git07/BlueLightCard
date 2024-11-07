export type CompanySummary = {
  companyID: string;
  legacyCompanyID?: number;
  companyName: string;
};

export type CompaniesResponse = {
  data: CompanySummary[];
};
