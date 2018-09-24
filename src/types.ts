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

interface RawProviders extends Record<string, RawProvider> {
  default: RawProvider;
}

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

interface Providers extends Record<string, Provider> {
  default: Provider;
}

export interface Configuration {
  defaultEnvironment: string;
  environmentVariable: string;
  packageManager: "npm" | "yarn";
  providers: Providers;
}
