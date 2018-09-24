import { readSchema } from "../src/read";
import { validate } from "../src/validate";

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
