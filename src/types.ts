import { JSONObject } from "./json";

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
