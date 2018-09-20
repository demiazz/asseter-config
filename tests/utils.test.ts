import { getByPath } from "../src/utils";

import { forEachJSONType } from "./helpers";

describe("getByPath", () => {
  describe("when value is not an object", () => {
    forEachJSONType((type, value) => {
      it(`throws an error when given value of ${type} type`, () => {
        expect(() => getByPath(value, [])).toThrowError(
          "Value must be an object"
        );
      });
    });
  });

  describe("when value is an object", () => {
    it("returns an same object when path is empty", () => {
      const object = { foo: "bar" };

      expect(getByPath(object, [])).toBe(object);
    });

    it("returns an value by given path", () => {
      const object = {
        foo: {
          bar: "baz"
        }
      };

      expect(getByPath(object, ["foo", "bar"])).toBe("baz");
    });

    it("throws an error if given path is not exist", () => {
      const object = {
        foo: [
          {
            bar: "baz"
          }
        ]
      };

      expect(() => getByPath(object, ["foo", "bar"])).toThrowError(
        "Path 'foo.bar' doesn't exists"
      );
    });
  });
});
