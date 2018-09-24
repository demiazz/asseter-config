import { readSchema } from "../src/read";
import { validate } from "../src/validate";

import { getFixture, getFixturePath } from "./helpers";

describe("validate", () => {
  describe("when data is valid", () => {
    it("returns empty array", () => {
      const schema = readSchema(getFixturePath("validate/schema.json"));
      const data = getFixture("validate/valid.json");

      expect(validate(schema, data)).toEqual([]);
    });
  });

  describe("when data is invalid", () => {
    it("returns array of errors", () => {
      const schema = readSchema(getFixturePath("validate/schema.json"));
      const data = getFixture("validate/invalid.json");

      expect(validate(schema, data)).toEqual([
        "root should NOT have additional properties",
        "root.point.x should be number",
        "root.point.y should be number"
      ]);
    });

    it("returns array of unique errors", () => {
      const schema = readSchema(getFixturePath("validate/schema.json"));
      const data = getFixture("validate/unique.json");

      expect(validate(schema, data)).toEqual([
        "root should NOT have additional properties",
        "root.point.x should be number",
        "root.point.y should be number"
      ]);
    });

    describe("when namespace is given", () => {
      it("returns array of errors with prefixed path", () => {
        const schema = readSchema(getFixturePath("validate/schema.json"));
        const data = getFixture("validate/namespace.json");

        expect(validate(schema, data, "points.initial")).toEqual([
          "root.points.initial should NOT have additional properties",
          "root.points.initial.point.x should be number",
          "root.points.initial.point.y should be number"
        ]);
      });
    });
  });
});
