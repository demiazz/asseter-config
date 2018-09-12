type Scalar = boolean | null | number | string | void;

export type JSONValue = Scalar | Scalar[] | { [index: string]: JSONValue };
