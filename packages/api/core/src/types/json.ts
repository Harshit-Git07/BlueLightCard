export type JsonValue = string | number | boolean | Date | null | JsonObject | JsonArray | undefined;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
