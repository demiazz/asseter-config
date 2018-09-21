export const reduceKeys = <U>(
  object: Record<string, any>,
  callback: (
    previousValue: U,
    currentValue: string,
    currentIndex: number,
    array: string[]
  ) => U,
  initialValue: U
) => Object.keys(object).reduce<U>(callback, initialValue);
