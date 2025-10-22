import isObject from "./isObject";
import stringToPath from "./stringToPath";

export default <T>(object: T, path?: string, defaultValues?: any): any => {
  if (!path || !isObject(object)) return object;

  return (
    stringToPath(path).reduce(
      (acc, key) => acc[key as keyof T & object],
      object
    ) ?? defaultValues
  );
};
