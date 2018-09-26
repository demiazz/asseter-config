import { extractFromEnvironment } from "../src/environment";

import { getFixture, setEnvironment } from "./helpers";

describe("extractFromEnvironment", () => {
  let restoreEnvironment: void | (() => void);

  afterEach(() => {
    if (restoreEnvironment) {
      restoreEnvironment();

      restoreEnvironment = undefined;
    }
  });

  describe("when suitable variables are not exist", () => {
    it("returns empty object", () => {
      expect(extractFromEnvironment("main")).toEqual({});
    });
  });

  describe("when suitable variables are exist", () => {
    it("returns object with extracted variables", () => {
      restoreEnvironment = setEnvironment({
        ASSETER_MAIN_MANIFEST: "manifest.json"
      });

      expect(extractFromEnvironment("main")).toEqual({
        manifest: "manifest.json"
      });
    });

    it("handle automatically converts names between cases", () => {
      restoreEnvironment = setEnvironment({
        ASSETER_MAIN_INTERFACE_MANIFEST_PATH: "/root/manifest.json"
      });

      expect(extractFromEnvironment("mainInterface")).toEqual({
        manifestPath: "/root/manifest.json"
      });
    });

    it("ignores variables for other namespaces", () => {
      restoreEnvironment = setEnvironment({
        ASSETER_LANDING_MANIFEST_PATH: "/root/landing-manifest.json",
        ASSETER_MAIN_MANIFEST: "manifest.json"
      });

      expect(extractFromEnvironment("main")).toEqual({
        manifest: "manifest.json"
      });
    });

    it("try to parse values from environment variables", () => {
      restoreEnvironment = setEnvironment((getFixture(
        "environment/environment.json"
      ) as any) as Record<string, string>);

      const expected = getFixture("environment/variables.json");

      expect(extractFromEnvironment("main")).toEqual(expected);
    });
  });
});
