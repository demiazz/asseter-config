import { validate } from "../validate";

import { getFixture, getFixturePath } from "./helpers";

describe("validate", () => {
  it("returns empty list of errors when data is valid", () => {
    const definitionPath = getFixturePath("validate/schema.json");
    const definitionObject = getFixture("validate/schema.json");
    const data = getFixture(`validate/valid.json`);

    [definitionPath, definitionObject].forEach(definition => {
      expect(validate(definition, data)).toEqual([]);
    });
  });

  it("returns list of errors when data is invalid", () => {
    const definitionPath = getFixturePath("validate/schema.json");
    const definitionObject = getFixture("validate/schema.json");
    const data = getFixture(`validate/invalid.json`);

    [definitionPath, definitionObject].forEach(definition => {
      expect(validate(definition, data)).toEqual([
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
});
