import { useContext } from "react";
import { FormContext } from "../components/form/form";

import get from "lodash.get";
import cloneDeep from "lodash.clonedeep";
import set from "lodash.set";

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
