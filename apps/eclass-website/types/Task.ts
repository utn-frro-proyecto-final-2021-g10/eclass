import { Task, Answer, Field } from "@prisma/client";

export interface FullTask extends Task {
  fields: Field[];
  answers: Answer[];
}
