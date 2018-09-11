import { validate } from "../validate";

import { getFixture } from "./helpers";

describe("validate", () => {
  it("returns empty list of errors when data is valid", () => {
    ["single-provider", "multiple-providers"].forEach(fixture => {
      const data = getFixture(`validate/${fixture}.json`);

      expect(validate(data)).toEqual([]);
    });
  });

  it("returns list of errors when data is invalid", () => {
    const data = getFixture("validate/empty.json");

    expect(validate(data)).toEqual([
      "configuration: should have required property 'packageManager'",
      "configuration: should have required property 'environmentVariable'",
      "configuration: should have required property 'defaultEnvironment'",
      "configuration: should have required property 'providers'"
    ]);
  });
});
