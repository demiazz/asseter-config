import { readFileSync } from 'fs';

import { readJSON, readSchema } from '../utils';

import { getFixturePath } from './helpers';

describe('readJSON', () => {
  it('reads and parse JSON file', () => {
    const fileName = getFixturePath('helpers/read.json');
    const expected = JSON.parse(readFileSync(fileName, { encoding: 'utf8' }));
    const actual = readJSON(fileName);

    expect(actual).toEqual(expected);
  });
});

describe('readSchema', () => {
  it('reads and parse JSON schema', () => {
    const schemaFileName = getFixturePath('helpers/schema.json');
    const schema = readSchema(schemaFileName);

    const validFileName = getFixturePath('helpers/valid.json');
    const valid = readJSON(validFileName);

    expect(schema(valid)).toBe(true);

    const invalidFileName = getFixturePath('helpers/invalid.json');
    const invalid = readJSON(invalidFileName);

    expect(schema(invalid)).toBe(false);
  });
});
