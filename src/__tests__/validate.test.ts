import { validate } from "../validate";

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
        const definition = getFixturePath("validate/schema.json");

        expect(() => validate(definition, value)).toThrowError(
          "Value must be an object"
        );
      });
    });
  });

  describe("when given path doesn't exist", () => {
    it("throws an error", () => {
      const definitionPath = getFixturePath("validate/schema.json");
      const data = {
        bar: [{ baz: "foo" }]
      };

      expect(() => validate(definitionPath, data, ["bar", "baz"])).toThrowError(
        "Path 'bar.baz' doesn't exists"
      );
    });
  });

  describe("when path is empty", () => {
    it("returns empty list of errors when data is valid", () => {
      const definitionPath = getFixturePath("validate/schema.json");
      const data = getFixture("validate/valid.json");

      expect(validate(definitionPath, data)).toEqual([]);
    });

    it("returns list of errors when data is invalid", () => {
      const definitionPath = getFixturePath("validate/schema.json");
      const data = getFixture("validate/invalid.json");

      expect(validate(definitionPath, data)).toEqual([
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
      const definitionPath = getFixturePath("validate/schema.json");
      const data = {
        firstLevel: {
          secondLevel: getFixture("validate/valid.json")
        }
      };

      expect(
        validate(definitionPath, data, ["firstLevel", "secondLevel"])
      ).toEqual([]);
    });

    it("returns list of errors when data is invalid", () => {
      const definitionPath = getFixturePath("validate/schema.json");
      const data = {
        firstLevel: {
          secondLevel: getFixture("validate/invalid.json")
        }
      };

      expect(
        validate(definitionPath, data, ["firstLevel", "secondLevel"])
      ).toEqual([
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
