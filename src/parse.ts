const isOctal = (value: string): boolean => /^\-?0\d+$/.test(value);

const isHexadecimal = (value: string): boolean =>
  /^\-?0(x|X)[0-9A-Fa-f]+$/.test(value);

const isDecimal = (value: string): boolean => /^\-?\d+$/.test(value);

const isFloat = (value: string): boolean =>
  /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(value);

export const parse = (value: string): boolean | null | number | string => {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  } else if (value === "null") {
    return null;
  } else if (isOctal(value)) {
    return parseInt(value, 8);
  } else if (isHexadecimal(value)) {
    return parseInt(value, 16);
  } else if (isDecimal(value)) {
    return parseInt(value, 10);
  } else if (isFloat(value)) {
    return parseFloat(value);
  }

  return value;
};
