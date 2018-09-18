import { readSchema } from "../src/read";
import { validate, ValidationError } from "../src/validate";

import { getFixture, getFixturePath } from "./helpers";

describe("validate", () => {
  [
    ["boolean", true],
    ["null", null],
    ["number", 10],
    ["string", ""],
    ["undefined", undefined],
    ["array", []]
  ].forEach(([type, value]) => {
    describe(`given value of type '${type}'`, () => {
      it("throws an error", () => {
        const schema = readSchema(getFixturePath("validate/schema.json"));

        expect(() => validate(schema, value)).toThrowError(
          "Value must be an object"
        );
      });
    });
  });

  describe("when given path doesn't exist", () => {
    it("throws an error", () => {
      const schema = readSchema(getFixturePath("validate/schema.json"));
      const data = {
        bar: [{ baz: "foo" }]
      };

      expect(() => validate(schema, data, ["bar", "baz"])).toThrowError(
        "Path 'bar.baz' doesn't exists"
      );
    });
  });

  describe("when path is empty", () => {
    it("returns empty list of errors when data is valid", () => {
      const schema = readSchema(getFixturePath("validate/schema.json"));
      const data = getFixture("validate/valid.json");

      expect(validate(schema, data)).toEqual([]);
    });

    it("returns list of errors when data is invalid", () => {
      const schema = readSchema(getFixturePath("validate/schema.json"));
      const data = getFixture("validate/invalid.json");

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

  describe("when given path is not empty", () => {
    it("returns empty list of errors when data by path is valid", () => {
      const schema = readSchema(getFixturePath("validate/schema.json"));
      const data = {
        firstLevel: {
          secondLevel: getFixture("validate/valid.json")
        }
      };

      expect(validate(schema, data, ["firstLevel", "secondLevel"])).toEqual([]);
    });

    it("returns list of errors when data is invalid", () => {
      const schema = readSchema(getFixturePath("validate/schema.json"));
      const data = {
        firstLevel: {
          secondLevel: getFixture("validate/invalid.json")
        }
      };

      expect(validate(schema, data, ["firstLevel", "secondLevel"])).toEqual([
        {
          message: "should NOT have additional properties",
          path: ".firstLevel.secondLevel"
        },
        {
          message: "should be string",
          path: ".firstLevel.secondLevel.foo"
        },
        {
          message: "should be string",
          path: ".firstLevel.secondLevel.bar"
        }
      ]);
    });
  });
});

describe("ValidationError", () => {
  describe(".constructor", () => {
    it("assembles message error from errors list", () => {
      const schema = readSchema(getFixturePath("validate/schema.json"));
      const data = getFixture("validate/invalid.json");
      const errors = validate(schema, data);
      const error = new ValidationError(errors);

      expect(error.message).toEqual(
        [
          "Invalid configuration:",
          "  root should NOT have additional properties",
          "  root.foo should be string",
          "  root.bar should be string"
        ].join("\n")
      );
    });
  });
});
