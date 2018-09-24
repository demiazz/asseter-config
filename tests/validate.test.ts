import { readSchema } from "../src/read";
import { newValidate } from "../src/validate";

import { getFixture, getFixturePath } from "./helpers";

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
