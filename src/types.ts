export type JSONScalar = boolean | null | number | string | void;

export interface JSONArray extends Array<JSONValue> {}

export interface JSONObject extends Record<string, JSONValue> {}

export type JSONValue = JSONScalar | JSONArray | JSONObject;

type ProviderOptions = Record<string, JSONScalar>;

interface RawProvider extends JSONObject {
  environment?: Record<string, ProviderOptions>;
  options: ProviderOptions;
  type: string;
}

type RawProviders = Record<string, RawProvider>;

export interface RawConfiguration extends JSONObject {
  defaultEnvironment: string;
  environmentVariable: string;
  packageManager: "npm" | "yarn";
  providers: RawProviders;
}

interface Provider {
  options: ProviderOptions;
  type: string;
}

type Providers = Record<string, Provider>;

export interface Configuration {
  defaultEnvironment: string;
  environmentVariable: string;
  packageManager: "npm" | "yarn";
  providers: Providers;
}
