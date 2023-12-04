const selectTblOfferTypeQuery = `
SELECT
    UUID() AS id,
    offerID AS legacyId,
    offerName AS name,
    is_searched AS isSearched
FROM tbloffertype;
`;
export default selectTblOfferTypeQuery;
