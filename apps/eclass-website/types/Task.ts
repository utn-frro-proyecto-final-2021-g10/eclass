import { Task, Answer, Form } from "@prisma/client";
import { FormWithFields } from "./FormWithTasks";

export interface FullTask extends Task {
  form: FormWithFields,
}
