import { readJSON, readSchema, validate } from '../utils';

import { getFixture, getFixturePath } from './helpers';

describe('readJSON', () => {
  it('reads and parses JSON file', () => {
    const fileName = getFixturePath('helpers/read.json');
    const expected = getFixture('helpers/read.json');
    const actual = readJSON(fileName);

    expect(actual).toEqual(expected);
  });
});

describe('readSchema', () => {
  it('reads and parses JSON schema', () => {
    const schemaFileName = getFixturePath('helpers/schema.json');
    const schema = readSchema(schemaFileName);

    const valid = getFixture('helpers/valid.json');

    expect(schema(valid)).toBe(true);

    const invalid = getFixture('helpers/invalid.json');

    expect(schema(invalid)).toBe(false);
  });
});

describe('validate', () => {
  describe('when configuration is valid', () => {
    it("doesn't throw an error", () => {
      const schemaPath = getFixturePath('helpers/schema.json');
      const configurationPath = getFixturePath('helpers/valid.json');

      expect(() => {
        validate(schemaPath, configurationPath);
      }).not.toThrow();
    });
  });

  describe('when configuration is invalid', () => {
    it("throws an error", () => {
      const schemaPath = getFixturePath('helpers/schema.json');
      const configurationPath = getFixturePath('helpers/invalid.json');

      expect(() => {
        validate(schemaPath, configurationPath);
      }).toThrow();
    });
  });
});
