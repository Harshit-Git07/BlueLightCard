const selectTblCompaniesQuery = (table_name: string, limit: number, offset: number) => `
SELECT
		UUID() as id,
		CONCAT('BLC_UK#', ID) AS legacyId,
		CompanyName as name,
		ContactEmail as email,
		ContactTel as phone,
		ContactName as contactName,
		ContactPosition as contactPosition,
		CompanyDescription as description,
		CompanyLargeLogo as largeLogo,
		CompanySmallLogo as smallLogo,
		WebsiteAddress as url,
		IsApproved as isApproved,
		TradeRegions as tradeRegion,
		PostCode as postCode,
		allowedOffers as maximumOfferCount,
		BusinessBuilding as building,
		BusinessStreet as street,
		BusinessLocality as county,
		BusinessTownCity as townCity,
		BusinessCountryCode as country,
		EEMerchantId as eagleEyeId,
		AffNetId as affiliateNetworkId,
		AffMerchId as affiliateMerchantId,
		IsAgeGated as isAgeGated
		FROM 
		${table_name}
		ORDER BY ID
		LIMIT ${limit}
		OFFSET ${offset};
`;

export default selectTblCompaniesQuery