import Ajv from 'ajv';
import { readFileSync } from 'fs';

type JSONScalar = string | number | boolean | null;

interface IJSON {
  [index: string]: IJSON | IJSON[] | JSONScalar | JSONScalar[];
}

export const readJSON = (fileName: string): IJSON => {
  const content = readFileSync(fileName, { encoding: 'utf8' });

  return JSON.parse(content) as IJSON;
}

export const readSchema = (fileName: string): Ajv.ValidateFunction => {
  const definition = readJSON(fileName);
  const schema = new Ajv();

  return schema.compile(definition);
}
