export const getFormValues = (formData?: FormData) => {
  if (!formData) return {};

  const values: { [k: string]: any } = {};
  formData.forEach((value, key) => {
    values[key] = value;
  });
  return values;
};
