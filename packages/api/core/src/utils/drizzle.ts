import { SQL, SQLWrapper, and } from "drizzle-orm";

export function every(...conditions: (SQLWrapper | undefined | null | false)[]): SQL | undefined {
  const filteredConditions = conditions.filter(Boolean);
  return and(...filteredConditions);
}
