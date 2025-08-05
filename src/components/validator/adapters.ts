import { isJoiSchema, isYupSchema, isZodSchema } from "./matchers";

export type ValidatorResult = {
  success: boolean;
  errors?: Record<string, string>;
  value?: any;
};

export interface ValidationAdapter {
  validate(data: any): Promise<ValidatorResult>;
}

export const yupAdapter = (schema: any): ValidationAdapter => ({
  async validate(data) {
    try {
      const result = await schema.validate(data, { abortEarly: false });
      return { success: true, value: result };
    } catch (err: any) {
      return {
        success: false,
        errors: err.inner.reduce((acc: any, curr: any) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {}),
      };
    }
  },
});

export const zodAdapter = (schema: any): ValidationAdapter => ({
  async validate(data) {
    const result = schema.safeParse(data);
    if (result.success) {
      return { success: true, value: result.data };
    }
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  },
});

export const joiAdapter = (schema: any): ValidationAdapter => ({
  async validate(data) {
    try {
      const result = await schema.validateAsync(data);
      return { success: true, value: result };
    } catch (err: any) {
      return {
        success: false,
        errors: err.details.reduce((acc: any, detail: any) => {
          acc[detail.path.join(".")] = detail.message;
          return acc;
        }, {}),
      };
    }
  },
});

export const autoAdapter = (schema: any): ValidationAdapter | null => {
  if (isJoiSchema(schema)) return joiAdapter(schema);
  if (isYupSchema(schema)) return yupAdapter(schema);
  if (isZodSchema(schema)) return zodAdapter(schema);

  return null;
};
