const selectTagsQuery = (tableName: string, limit: number, offset: number) =>  `
	SELECT Tag AS name FROM ${tableName} ORDER BY ID LIMIT ${limit} OFFSET ${offset};`;

export default selectTagsQuery;