import { Config } from "sst/node/config";

export async function setupE2eEnvironmentVars() {
  process.env.E2E_IDENTITY_TABLE_NAME = Config.IDENTITY_TABLE_NAME;
  process.env.E2E_ID_MAPPING_TABLE_NAME = Config.ID_MAPPING_TABLE_NAME;
  process.env.E2E_EVENT_BUS_NAME = Config.SHARED_EVENT_BUS_NAME;
}