import get from "../logic/get";

describe("get", () => {
  it("should return the value at the specified path", () => {
    const obj = { a: { b: { c: 42 } } };
    const result = get(obj, "a.b.c");
    expect(result).toBe(42);
  });

  it("should return the default value if the path is not found", () => {
    const obj = { a: { b: { c: 42 } } };
    const result = get(obj, "a.b.d", "default");
    expect(result).toBe("default");
  });

  it("should return the default value if the object is not found", () => {
    const result = get(null, "a.b.c", "default");
    expect(result).toBe("default");
  });
});
