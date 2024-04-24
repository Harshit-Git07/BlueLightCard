export type JsonValue = string | number | boolean | null | JsonObject | JsonArray | undefined;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
