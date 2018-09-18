/* tslint:disable: interface-name */

type JSONScalar = boolean | null | number | string | void;

interface JSONArray extends Array<JSONValue> {}

interface JSONObject extends Record<string, JSONValue> {}

export type JSONValue = JSONScalar | JSONArray | JSONObject;

type PackageManager = "npm" | "yarn";

type ProviderOptions = JSONObject;

type ProviderEnvironmentOptions = Record<string, ProviderOptions>;

interface Provider extends JSONObject {
  environment?: ProviderEnvironmentOptions;
  options: ProviderOptions;
  type: string;
}

interface Providers extends Record<string, Provider> {
  default: Provider;
}

export interface Configuration extends JSONObject {
  defaultEnvironment: string;
  environmentVariable: string;
  packageManager: PackageManager;
  providers: Providers;
}
