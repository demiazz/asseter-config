import { read, readSchema } from "../src/read";

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
