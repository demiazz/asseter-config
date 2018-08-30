import { readFileSync } from 'fs';

import { readJSON } from '../utils';

import { getFixturePath } from './helpers';

describe('readJSON', () => {
  it('reads and parse JSON file', () => {
    const fileName = getFixturePath('helpers/read.json');
    const expected = JSON.parse(readFileSync(fileName, { encoding: 'utf8' }));
    const actual = readJSON(fileName);

    expect(actual).toEqual(expected);
  });
});
