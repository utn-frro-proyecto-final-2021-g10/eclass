import { Field, Form } from "@prisma/client";

export interface FormWithFields extends Form {
  fields: Field[],
}
