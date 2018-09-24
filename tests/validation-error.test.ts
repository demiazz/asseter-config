import { readSchema } from "../src/read";
import { validate } from "../src/validate";
import { ValidationError } from "../src/validation-error";

import { getFixture, getFixturePath } from "./helpers";

describe("ValidationError", () => {
  describe(".constructor", () => {
    it("assembles message error from errors list", () => {
      const schema = readSchema(getFixturePath("validation-error/schema.json"));
      const data = getFixture("validation-error/invalid.json");
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
