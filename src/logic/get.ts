import isObject from "./isObject";
import stringToPath from "./stringToPath";

export default <T>(
  object: T,
  path?: string,
  defaultValues: any = null
): any => {
  console.log("get called with:", { object, path, defaultValues });

  if (!object) return defaultValues;

  if (!Object.keys(object).length) return defaultValues;

  if (!path || !isObject(object)) return object;

  return (
    stringToPath(path).reduce(
      (acc, key) => acc[key as keyof T & object],
      object
    ) ?? defaultValues
  );
};
