import type { AnySchema } from "yup";
import type { ZodAny } from "zod";
import type { Schema } from "joi";

export function isZodSchema(schema: any): schema is ZodAny {
  return typeof schema?.safeParse === "function";
}

export function isJoiSchema(schema: any): schema is Schema {
  return (
    typeof schema?.validateAsync === "function" &&
    typeof schema?.describe === "function"
  );
}

export function isYupSchema(schema: any): schema is AnySchema {
  return (
    typeof schema?.validate === "function" &&
    typeof schema?.describe === "function" &&
    typeof schema?.cast === "function"
  );
}
