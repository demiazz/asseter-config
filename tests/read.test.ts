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
      number: getFixturePath("read/readSchemas/number-schema.json"),
      string: getFixturePath("read/readSchemas/string-schema.json")
    };
    const schemas = readSchemas(schemasPaths);
    const numberData = getFixture("read/readSchemas/number.json");
    const stringData = getFixture("read/readSchemas/string.json");

    expect(schemas.number(numberData)).toBe(true);
    expect(schemas.number(stringData)).toBe(false);
    expect(schemas.string(numberData)).toBe(false);
    expect(schemas.string(stringData)).toBe(true);
  });
});
