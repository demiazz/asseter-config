/* tslint:disable: interface-name */

type JSONScalar = boolean | null | number | string | void;

interface JSONArray extends Array<JSONValue> {};

interface JSONObject extends Record<string, JSONValue> {};

export type JSONValue = JSONScalar | JSONArray | JSONObject;
