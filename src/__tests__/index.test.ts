import { read, readSchema, validate } from "..";

import { getFixture, getFixturePath } from "./helpers";

describe("read", () => {
  ["json", "yml", "yaml", "toml"].forEach(format => {
    describe(`when given file with '.${format}' extension`, () => {
      it("reads a given file", () => {
        const fileName = getFixturePath(`index/read.${format}`);
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
      const fileName = getFixturePath("index/read.ini");

      expect(() => read(fileName)).toThrowError(
        "Supported only JSON, YAML and TOML file types"
      );
    });
  });
});

describe("readSchema", () => {
  it("reads and parses JSON schema", () => {
    const schemaFileName = getFixturePath("index/schema.json");
    const schema = readSchema(schemaFileName);

    const valid = getFixture("index/valid.json");

    expect(schema(valid)).toBe(true);

    const invalid = getFixture("index/invalid.json");

    expect(schema(invalid)).toBe(false);
  });
});

describe("validate", () => {
  describe("when configuration is valid", () => {
    it("doesn't throw an error", () => {
      const schemaPath = getFixturePath("index/schema.json");
      const configurationPath = getFixturePath("index/valid.json");

      expect(() => {
        validate(schemaPath, configurationPath);
      }).not.toThrowError();
    });
  });

  describe("when configuration is invalid", () => {
    it("throws an error", () => {
      const schemaPath = getFixturePath("index/schema.json");
      const configurationPath = getFixturePath("index/invalid.json");

      expect(() => {
        validate(schemaPath, configurationPath);
      }).toThrowError();
    });

    it("throws an error with all errors information", () => {
      const schemaPath = getFixturePath("index/schema.json");
      const configurationPath = getFixturePath("index/invalid.json");

      expect(() => {
        validate(schemaPath, configurationPath);
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
