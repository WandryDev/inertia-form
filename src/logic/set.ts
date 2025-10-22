import isKey from "./isKey";
import isObject from "./isObject";
import stringToPath from "./stringToPath";

export default <T>(object: T, path: string, value?: unknown) => {
  let index = -1;
  const tempPath = isKey(path) ? [path] : stringToPath(path);
  const length = tempPath.length;
  const lastIndex = length - 1;

  while (++index < length) {
    const key = tempPath[index];
    let newValue = value;

    if (index !== lastIndex) {
      const objValue = object[key as keyof T & object];
      newValue =
        isObject(objValue) || Array.isArray(objValue)
          ? objValue
          : !isNaN(+tempPath[index + 1])
          ? []
          : {};
    }

    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return;
    }

    object[key as keyof T & object] = newValue as T[keyof T & object];
    object = object[key as keyof T & object] as T;
  }
};
