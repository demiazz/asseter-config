const isOctal = (value: string): boolean => /^[-+]?0\d+$/.test(value);

const isHexadecimal = (value: string): boolean =>
  /^[-+]?0(x|X)[0-9A-Fa-f]+$/.test(value);

const isDecimal = (value: string): boolean => /^[-+]?\d+$/.test(value);

const isFloat = (value: string): boolean =>
  /^[-+]?\d*\.?\d+([eE][-+]?\d+)?$/.test(value);

export const parse = (value: string): boolean | null | number | string => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value === "null") {
    return null;
  }

  if (isOctal(value)) {
    return parseInt(value, 8);
  }

  if (isHexadecimal(value)) {
    return parseInt(value, 16);
  }

  if (isDecimal(value)) {
    return parseInt(value, 10);
  }

  if (isFloat(value)) {
    return parseFloat(value);
  }

  return value;
};
