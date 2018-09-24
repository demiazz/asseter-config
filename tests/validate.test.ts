import { readSchema } from "../src/read";
import { validate, validateRoot } from "../src/validate";

import { getFixture, getFixturePath } from "./helpers";

describe("validate", () => {
  const schemaPath = getFixturePath("validate/validate/schema.json");

  it("returns empty list of errors when data is valid", () => {
    const schema = readSchema(schemaPath);
    const data = getFixture("validate/validate/valid.json");

    expect(validate(schema, data)).toEqual([]);
  });

  it("returns list of errors when data is invalid", () => {
    const schema = readSchema(schemaPath);
    const data = getFixture("validate/validate/invalid.json");

    expect(validate(schema, data)).toEqual([
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

  it("returns list of unique errors when data is invalid", () => {
    const schema = readSchema(schemaPath);
    const data = getFixture("validate/validate/repeated.json");

    expect(validate(schema, data)).toEqual([
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

describe("validateRoot", () => {
  describe("when given data is valid", () => {
    it("returns empty errors list", () => {
      const data = getFixture("validate/validate-root/valid.json");

      expect(validateRoot(data)).toEqual([]);
    });
  });

  describe("when given data is invalid", () => {
    it("returns errors list", () => {
      const data = getFixture("validate/validate-root/invalid.json");

      expect(validateRoot(data)).toEqual([
        {
          message: "should have required property 'defaultEnvironment'",
          path: ""
        },
        {
          message: "should have required property 'environmentVariable'",
          path: ""
        },
        {
          message: "should have required property 'packageManager'",
          path: ""
        },
        {
          message: "should have required property 'providers'",
          path: ""
        }
      ]);
    });
  });
});
