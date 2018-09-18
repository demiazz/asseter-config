import { load } from "../src/load";
import { getFixture, getFixturePath } from "./helpers";

describe("load", () => {
  ["json", "toml", "yaml", "yml"].forEach(format => {
    describe(`when given file with '.${format}' extension`, () => {
      it("reads a raw configuration from a file", () => {
        const expected = getFixture(`load/valid-expected.json`);
        const actual = load(getFixturePath(`load/valid.${format}`));

        expect(actual).toEqual(expected);
      });

      describe("when given file has a wrong format", () => {
        const configurationPath = getFixturePath(`load/invalid.${format}`);

        expect(() => load(configurationPath)).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
