import { CATEGORY_TYPES } from "../../../utils/global-constants";

const type = CATEGORY_TYPES.COMPANY;

const selectTblBusinessCatsQuery = `
    SELECT 
    UUID() AS id, 
    CONCAT('blc-uk#', id) AS legacyId,
    catname AS name,
    "${type}" AS type,
    "" AS parentCategoryId, 
    NULL AS description,
    NULL AS imageThumb
    FROM tblbusinesscats;
`;

export default selectTblBusinessCatsQuery;