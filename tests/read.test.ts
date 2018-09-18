import { JSONValue } from "../src/json";
import { read, readSchema, readSchemas } from "../src/read";

import { getFixture, getFixturePath } from "./helpers";

describe("read", () => {
  ["json", "toml", "yaml", "yml"].forEach(format => {
    describe(`when given file with '.${format}' extension`, () => {
      it("reads a given file", () => {
        const fileName = getFixturePath(`read/read.${format}`);
        const expected = {
          firstLevel: {
            secondLevel: {
              thirdLevel: {
                key: "value"
              }
            }
          }
        };
        const actual = read(fileName);

        expect(actual).toEqual(expected);
      });
    });
  });

  describe("when given file of unsupported type", () => {
    it("throws an error", () => {
      const fileName = getFixturePath("read/read.ini");

      expect(() => read(fileName)).toThrowError(
        "Supported only JSON, YAML and TOML file types"
      );
    });
  });
});

describe("readSchema", () => {
  let valid: JSONValue;
  let invalid: JSONValue;

  beforeAll(() => {
    valid = getFixture("read/valid.json");
    invalid = getFixture("read/invalid.json");
  });

  describe("when given a schema's filename", () => {
    ["json", "toml", "yaml", "yml"].forEach(format => {
      describe(`when given a file with '${format}' extension`, () => {
        it("reads and parses JSON schema", () => {
          const schemaFileName = getFixturePath(`read/readSchema.${format}`);
          const validate = readSchema(schemaFileName);

          expect(validate(valid)).toBe(true);
          expect(validate(invalid)).toBe(false);
        });
      });
    });
  });
});

describe("readSchemas", () => {
  let valid: JSONValue;
  let invalid: JSONValue;

  beforeAll(() => {
    valid = getFixture("read/valid.json");
    invalid = getFixture("read/invalid.json");
  });

  it("reads and parses given JSON schemas", () => {
    const definitionPaths = {
      json: getFixturePath("read/readSchema.json"),
      toml: getFixturePath("read/readSchema.toml"),
      yaml: getFixturePath("read/readSchema.yaml"),
      yml: getFixturePath("read/readSchema.yml")
    };
    const schemas = readSchemas(definitionPaths);

    Object.keys(definitionPaths).forEach(schemaName => {
      const validate = schemas[schemaName];

      expect(validate(valid)).toBe(true);
      expect(validate(invalid)).toBe(false);
    });
  });
});
