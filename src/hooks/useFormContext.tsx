import { useContext } from "react";

import { FormContext } from "../core/form/form";

import cloneDeep from "../logic/cloneObject";
import set from "../logic/set";
import get from "../logic/get";

export const useFormContext = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("Field must be used inside Form component");
  }

  const getValues = (name?: string, defaultValue?: any) => {
    if (!name) {
      return context.form.data;
    }

    return get(context.form.data, name, defaultValue);
  };

  const setValue = (name: string, value: any) => {
    return context.form.setData((data: any = {}) => {
      const clonedData = cloneDeep(data);
      set(clonedData, name, value);

      return clonedData;
    });
  };

  return {
    ...context,
    getValues,
    setValue,
  };
};
