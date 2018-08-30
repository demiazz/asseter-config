import { readFileSync } from 'fs';
import { join } from 'path';

export const getFixturePath = (fileName: string): string => {
  return join(__dirname, 'fixtures', fileName);
}

export const getFixture = (fileName: string): any => {
  const fixturePath = getFixturePath(fileName);
  const content = readFileSync(fixturePath, { encoding: 'utf8' });

  return JSON.parse(content);
}
