import { getFormValues } from "./getFormValues";

export const eventToFormValues = (e: React.FormEvent<HTMLFormElement>) => {
  if (e === null) return {};
  const form = e.currentTarget;
  const data = new FormData(form);
  return getFormValues(data);
};
