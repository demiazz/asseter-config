import { read, readSchema, readSchemas } from "../src/read";

import { getFixture, getFixturePath } from "./helpers";

describe("read", () => {
  it("reads a given file", () => {
    const expected = getFixture("read/read/expected.json");
    const actual = read(getFixturePath("read/read/actual.json"));

    expect(actual).toEqual(expected);
  });
});

describe("readSchema", () => {
  it("reads and parses JSON schema from a file", () => {
    const valid = getFixture("read/readSchema/valid.json");
    const invalid = getFixture("read/readSchema/invalid.json");
    const schema = readSchema(getFixturePath("read/readSchema/actual.json"));

    expect(schema(valid)).toBe(true);
    expect(schema(invalid)).toBe(false);
  });
});

describe("readSchemas", () => {
  it("reads and parses given JSON schemas", () => {
    const schemasPaths = {
      json: getFixturePath("read/readSchemas/actual.json")
    };
    const actual = readSchemas(schemasPaths);

    // NOTE: use schemas' names from `schemasPaths` to ensure they are exist
    //       in `actual`.
    Object.keys(schemasPaths).forEach(schemaName => {
      const valid = getFixture("read/readSchemas/valid.json");
      const invalid = getFixture("read/readSchemas/invalid.json");
      const validate = actual[schemaName];

      expect(validate(valid)).toBe(true);
      expect(validate(invalid)).toBe(false);
    });
  });
});
