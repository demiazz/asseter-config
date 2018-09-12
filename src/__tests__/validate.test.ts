import { validate } from "../validate";

import { getFixture, getFixturePath } from "./helpers";

describe("validate", () => {
  it("returns empty list of errors when data is valid", () => {
    const definitionPath = getFixturePath("validate/schema.json");
    const data = getFixture(`validate/valid.json`);

    expect(validate(definitionPath, data as any)).toEqual([]);
  });

  it("returns list of errors when data is invalid", () => {
    const definitionPath = getFixturePath("validate/schema.json");
    const data = getFixture(`validate/invalid.json`);

    expect(validate(definitionPath, data as any)).toEqual([
      {
        message: "should NOT have additional properties",
        path: ""
      },
      {
        message: "should be string",
        path: ".foo"
      },
      {
        message: "should be string",
        path: ".bar"
      }
    ]);
  });
});
