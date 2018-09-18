import { load } from "../src";
import { load as originalLoad } from "../src/load";

describe("exports", () => {
  it("exports `load`", () => {
    expect(load).toBe(originalLoad);
  });
});
