export type JSONScalar = boolean | null | number | string | void;

export interface JSONArray extends Array<JSONValue> {}

export interface JSONObject extends Record<string, JSONValue> {}

export type JSONValue = JSONScalar | JSONArray | JSONObject;

type RawProviderOptions = JSONObject;

type RawProviderEnvironmentOptions = Record<string, RawProviderOptions>;

interface RawProvider extends JSONObject {
  environment?: RawProviderEnvironmentOptions;
  options: RawProviderOptions;
  type: string;
}

interface RawProviders extends Record<string, RawProvider> {
  default: RawProvider;
}

export interface RawConfiguration extends JSONObject {
  defaultEnvironment: string;
  environmentVariable: string;
  packageManager: "npm" | "yarn";
  providers: RawProviders;
}
