import { parse } from "../src/parse";

describe("parse", () => {
  it("parses scalar values", () => {
    const samples = [
      { actual: "true", expected: true },
      { actual: "false", expected: false },
      { actual: "null", expected: null },
      { actual: "10", expected: 10 },
      { actual: "-10", expected: -10 },
      { actual: "0777", expected: 511 },
      { actual: "-0777", expected: -511 },
      { actual: "0xf00d", expected: 61453 },
      { actual: "-0xf00d", expected: -61453 },
      { actual: "0Xf00d", expected: 61453 },
      { actual: "-0Xf00d", expected: -61453 },
      { actual: "0xF00D", expected: 61453 },
      { actual: "-0xF00D", expected: -61453 },
      { actual: "0XF00D", expected: 61453 },
      { actual: "-0XF00D", expected: -61453 },
      { actual: "1.2", expected: 1.2 },
      { actual: "0.1", expected: 0.1 },
      { actual: "-1.2", expected: -1.2 },
      { actual: "-0.1", expected: -0.1 },
      { actual: "1.2e2", expected: 1.2e2 },
      { actual: "1.2e-2", expected: 1.2e-2 },
      { actual: "-1.2e2", expected: -1.2e2 },
      { actual: "-1.2e-2", expected: -1.2e-2 },
      { actual: "1.2E2", expected: 1.2e2 },
      { actual: "1.2E-2", expected: 1.2e-2 },
      { actual: "-1.2E2", expected: -1.2e2 },
      { actual: "-1.2E-2", expected: -1.2e-2 },
      { actual: "this is string", expected: "this is string" }
    ];
    const actual = samples.map(({ actual: value }) => parse(value));
    const expected = samples.map(({ expected: value }) => value);

    expect(actual).toEqual(expected);
  });
});
