import Ajv from 'ajv';
import { readFileSync } from 'fs';

export const readJSON = (fileName: string): JSON => {
  const content = readFileSync(fileName, { encoding: 'utf8' });

  return JSON.parse(content) as JSON;
}

export const readSchema = (fileName: string): Ajv.ValidateFunction => {
  const definition = readJSON(fileName);
  const schema = new Ajv();

  return schema.compile(definition);
}
