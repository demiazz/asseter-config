import { readSchema } from "../src/read";
import { newValidate, validate, validateRoot } from "../src/validate";

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

describe("newValidate", () => {
  describe("when data is valid", () => {
    it("returns empty array", () => {
      const schema = readSchema(
        getFixturePath("validate/new-validate/schema.json")
      );
      const data = getFixture("validate/new-validate/valid.json");

      expect(newValidate(schema, data)).toEqual([]);
    });
  });

  describe("when data is invalid", () => {
    it("returns array of errors", () => {
      const schema = readSchema(
        getFixturePath("validate/new-validate/schema.json")
      );
      const data = getFixture("validate/new-validate/invalid.json");

      expect(newValidate(schema, data)).toEqual([
        "root should NOT have additional properties",
        "root.point.x should be number",
        "root.point.y should be number"
      ]);
    });

    it("returns array of unique errors", () => {
      const schema = readSchema(
        getFixturePath("validate/new-validate/schema.json")
      );
      const data = getFixture("validate/new-validate/unique.json");

      expect(newValidate(schema, data)).toEqual([
        "root should NOT have additional properties",
        "root.point.x should be number",
        "root.point.y should be number"
      ]);
    });

    describe("when namespace is given", () => {
      it("returns array of errors with prefixed path", () => {
        const schema = readSchema(
          getFixturePath("validate/new-validate/schema.json")
        );
        const data = getFixture("validate/new-validate/namespace.json");

        expect(newValidate(schema, data, "points.initial")).toEqual([
          "root.points.initial should NOT have additional properties",
          "root.points.initial.point.x should be number",
          "root.points.initial.point.y should be number"
        ]);
      });
    });
  });
});
