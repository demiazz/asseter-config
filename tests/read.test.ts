import { JSONValue } from "../src/json";
import { read, readSchema, readSchemas } from "../src/read";

import { forEachFormat, getFixture, getFixturePath } from "./helpers";

describe("read", () => {
  forEachFormat(format => {
    describe(`when given file with '.${format}' extension`, () => {
      it("reads a given file", () => {
        const expected = getFixture("read/read/expected.json");
        const actual = read(getFixturePath(`read/read/actual.${format}`));

        expect(actual).toEqual(expected);
      });
    });
  });

  describe("when given file of unsupported type", () => {
    it("throws an error", () => {
      const fileName = getFixturePath("read/read/read.yaml");

      expect(() => read(fileName)).toThrowError(
        "Supported only JSON file types"
      );
    });
  });
});

describe("readSchema", () => {
  let valid: JSONValue;
  let invalid: JSONValue;

  beforeEach(() => {
    valid = getFixture("read/readSchema/valid.json");
    invalid = getFixture("read/readSchema/invalid.json");
  });

  describe("when given a schema's filename", () => {
    forEachFormat(format => {
      describe(`when given a file with '${format}' extension`, () => {
        it("reads and parses JSON schema", () => {
          const schema = readSchema(
            getFixturePath(`read/readSchema/actual.${format}`)
          );

          expect(schema(valid)).toBe(true);
          expect(schema(invalid)).toBe(false);
        });
      });
    });
  });
});

describe("readSchemas", () => {
  let valid: JSONValue;
  let invalid: JSONValue;

  beforeEach(() => {
    valid = getFixture("read/readSchemas/valid.json");
    invalid = getFixture("read/readSchemas/invalid.json");
  });

  it("reads and parses given JSON schemas", () => {
    const schemasPaths = {
      json: getFixturePath("read/readSchemas/actual.json")
    };
    const actual = readSchemas(schemasPaths);

    // NOTE: use schemas' names from `schemasPaths` to ensure they are exist
    //       in `actual`.
    Object.keys(schemasPaths).forEach(schemaName => {
      const validate = actual[schemaName];

      expect(validate(valid)).toBe(true);
      expect(validate(invalid)).toBe(false);
    });
  });
});
