import { CATEGORY_TYPES } from "../../../utils/global-constants";

const type = CATEGORY_TYPES.OFFER;

const selectTblCatsQuery = `
    SELECT 
    UUID() AS id, 
    CONCAT('blc-uk#', id) AS legacyId,
    catname AS name, 
    "${type}" AS type, 
    "" AS parentCategoryId, 
    NULLIF(freetext, '') AS description, 
    imgThumb AS imageThumb 
    FROM tblcats;
`;

export default selectTblCatsQuery