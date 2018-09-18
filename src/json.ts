export type JSONScalar = boolean | null | number | string | void;

export interface JSONArray extends Array<JSONValue> {}

export interface JSONObject extends Record<string, JSONValue> {}

export type JSONValue = JSONScalar | JSONArray | JSONObject;
