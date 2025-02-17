import path from 'path';
import { OrganisationModel } from '@blc-mono/shared/models/members/organisationModel';
import { CreateEmployerModel } from '@blc-mono/shared/models/members/employerModel';
import { EmploymentStatus } from '@blc-mono/shared/models/members/enums/EmploymentStatus';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';
import { v4 as uuidv4 } from 'uuid';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import {
  SupportedDocumentModel,
  IdRequirementsModel,
} from '@blc-mono/shared/models/members/idRequirementsModel';
import { parseCsvFile } from '@blc-mono/members/application/services/organisation/id-mapping/csv/csvParser';
import { logger } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

export interface OrganisationIdMapping {
  brand: string;
  employmentStatus: string;
  organisation: string;
  employer: string;
  idKey: string;
  idType: string;
  moreThanOneId: string;
  minimumRequired: number;
  required: string;
  supportedDocuments: string;
  idTitle: string;
  idGuidelines: string;
  idDescription: string;
}

export async function getOrganisationIdMappings(): Promise<Map<string, OrganisationIdMapping[]>> {
  const organisationIdMappings = new Map<string, OrganisationIdMapping[]>();
  try {
    const parseFile = await parseCsvFile(
      path.join(__dirname, '../../../../data/organisationEmployerIdMapping.csv'),
    );

    parseFile.forEach((row) => {
      const brand = row['Brand'];

      if (brand === getBrandFromEnv()) {
        const organisationName = row['Organisation'];
        const organisationIdMapping = {
          brand,
          employmentStatus: row['Employment Status'],
          organisation: row['Organisation'],
          employer: row['Employer'],
          idKey: row['idKey'],
          idType: row['idType'],
          idTitle: row['idTitle'],
          idGuidelines: row['Selected option copy'],
          idDescription: row['Selector Copy'],
          moreThanOneId: row['More than 1 ID'],
          minimumRequired: Number(row['minimumRequired']),
          required: row['required'],
          supportedDocuments: row['supportedDocuments'],
        };
        if (organisationIdMappings.has(organisationName)) {
          organisationIdMappings.get(organisationName)?.push(organisationIdMapping);
        } else {
          organisationIdMappings.set(organisationName, [organisationIdMapping]);
        }
      }
    });
  } catch (error) {
    logger.error({ message: `Error parsing organisation ID mapping ${JSON.stringify(error)}` });
  }
  return organisationIdMappings;
}

export function mapOrganisationsAndEmployers(
  organisationIdMappings: Map<string, OrganisationIdMapping[]>,
) {
  const organisations: OrganisationModel[] = [];
  const employers = new Map<string, CreateEmployerModel[]>();

  for (const organisationName of organisationIdMappings.keys()) {
    const mappingsByOrganisation = organisationIdMappings.get(organisationName) ?? [];
    const organisationId = uuidv4();

    employers.set(organisationId, mapEmployers(mappingsByOrganisation));

    const organisation: OrganisationModel = {
      organisationId,
      name: organisationName,
      active: true,
      employmentStatus: mapEmploymentStatus(mappingsByOrganisation),
      employedIdRequirements: getCommonIdDocuments(
        employers.get(organisationId),
        EmploymentStatus.EMPLOYED,
      ),
      retiredIdRequirements: getCommonIdDocuments(
        employers.get(organisationId),
        EmploymentStatus.RETIRED,
      ),
      volunteerIdRequirements: getCommonIdDocuments(
        employers.get(organisationId),
        EmploymentStatus.VOLUNTEER,
      ),
      lastUpdated: new Date().toISOString(),
      trustedDomains: [],
    };
    organisations.push(organisation);
  }

  return {
    organisations,
    employers,
  };
}
export function mapEmployers(mappingsByOrganisation: OrganisationIdMapping[]) {
  const employers: CreateEmployerModel[] = [];
  const mappingsByEmployers = new Map<string, OrganisationIdMapping[]>();

  mappingsByOrganisation.forEach((rule) => {
    if (mappingsByEmployers.has(rule.employer)) {
      mappingsByEmployers.get(rule.employer)?.push(rule);
    } else {
      mappingsByEmployers.set(rule.employer, [rule]);
    }
  });

  for (const employerName of mappingsByEmployers.keys()) {
    const employerMappings = mappingsByEmployers.get(employerName) ?? [];
    const employer: CreateEmployerModel = {
      name: employerName,
      active: true,
      employmentStatus: mapEmploymentStatus(employerMappings),
      employedIdRequirements: mapIdRequirements(employerMappings, EmploymentStatus.EMPLOYED),
      retiredIdRequirements: mapIdRequirements(employerMappings, EmploymentStatus.RETIRED),
      volunteerIdRequirements: mapIdRequirements(employerMappings, EmploymentStatus.VOLUNTEER),
      trustedDomains: [],
    };
    employers.push(employer);
  }
  return employers;
}

export function mapEmploymentStatus(mappings: OrganisationIdMapping[]): EmploymentStatus[] {
  const employmentStatuses = new Set<EmploymentStatus>();

  mappings.forEach((mapping) => {
    const status = mapping.employmentStatus.toUpperCase();
    if (status.includes(EmploymentStatus.VOLUNTEER)) {
      employmentStatuses.add(EmploymentStatus.VOLUNTEER);
      return;
    }
    if (status.includes(EmploymentStatus.RETIRED)) {
      employmentStatuses.add(EmploymentStatus.RETIRED);
      return;
    }
    employmentStatuses.add(EmploymentStatus.EMPLOYED);
  });

  return Array.from(employmentStatuses);
}

export function mapIdRequirements(
  mappings: OrganisationIdMapping[],
  employmentStatus: EmploymentStatus,
): IdRequirementsModel | undefined {
  const supportedDocuments: SupportedDocumentModel[] = [];
  let minimumRequired = 1;

  mappings.forEach((rule) => {
    if (rule.employmentStatus.toUpperCase().includes(employmentStatus)) {
      if (Object.values(IdType).includes(rule.idType as IdType)) {
        supportedDocuments.push({
          idKey: rule.idKey,
          type: rule.idType.toUpperCase() as IdType,
          title: rule.idTitle,
          guidelines: rule.idGuidelines,
          description: rule.idDescription,
          required: rule.required === 'true',
        });
        minimumRequired = Math.max(rule.minimumRequired, minimumRequired);
      }
    }
  });

  if (supportedDocuments.length > 0) {
    return {
      minimumRequired,
      supportedDocuments,
    };
  }
  return undefined;
}

function getCommonIdDocuments(
  employers: CreateEmployerModel[] | undefined,
  employmentStatus: EmploymentStatus,
) {
  const documents: SupportedDocumentModel[][] = [];
  let minimumRequired = 1;

  employers?.forEach((employer) => {
    let idRequirements: IdRequirementsModel | undefined = undefined;
    if (employmentStatus === EmploymentStatus.RETIRED) {
      idRequirements = employer.retiredIdRequirements;
    }
    if (employmentStatus === EmploymentStatus.EMPLOYED) {
      idRequirements = employer.employedIdRequirements;
    }
    if (employmentStatus === EmploymentStatus.VOLUNTEER) {
      idRequirements = employer.volunteerIdRequirements;
    }
    if (idRequirements !== undefined) {
      documents.push(idRequirements.supportedDocuments);
      minimumRequired = idRequirements.minimumRequired;
    }
  });

  if (documents.length === 0) {
    return undefined;
  }
  const commonIdDocuments = documents.reduce((acc, curr) => {
    return acc.filter((doc) => curr.some((d) => d.idKey === doc.idKey));
  });

  if (commonIdDocuments.length === 0) {
    return undefined;
  }

  return {
    minimumRequired,
    supportedDocuments: commonIdDocuments,
  };
}
