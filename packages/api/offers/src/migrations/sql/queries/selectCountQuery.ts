const selectCountQuery = (tableName: string) => `SELECT COUNT(*) AS count FROM ${tableName};`;

export default selectCountQuery;