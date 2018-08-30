import { join } from 'path';

export const getFixturePath = (fileName: string): string => {
  return join(__dirname, 'fixtures', fileName);
}
