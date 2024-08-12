import { ZodError } from "zod";
import { Logger } from "@aws-lambda-powertools/logger";

import { filterUndefinedValuesIgnoreZero } from "../../utils/filters";
import { Company, CompanyModel } from "src/models/company";

const getValidCompaniesReducer = (logger: Logger) => (accumulator: Company[], company: Company) => {
  const filteredCompanies = filterUndefinedValuesIgnoreZero(company);
  const formattedCompany = {
    ...filteredCompanies,
    isAgeGated: filteredCompanies.isAgeGated ? true : false,
    isApproved: filteredCompanies.isApproved ? true : false
  }

  try {
    const parsedCompany = CompanyModel.parse(formattedCompany);
    accumulator.push(parsedCompany);
  } catch (err) {
    logger.error('Invalid company: ', company);
    if (err instanceof ZodError) {
      logger.error(err.message);
    }
  }

  return accumulator;
}

export default getValidCompaniesReducer;
