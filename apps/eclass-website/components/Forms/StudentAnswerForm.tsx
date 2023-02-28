import { FormLabel, Input, RadioGroup, Radio } from "@chakra-ui/react";
import field from "../../pages/api/v1/field";
import { GridItemInput } from "./common/GridItemInput";

interface Props {
  field: any;
  answer?: string;
}
const StudentAnswerForm = ({ field, answer }: Props) => {
  return (
    <>
      {field.type === "text" && (
        <GridItemInput
          colSpan={12}
          name={field.id}
          defaultValue={answer || ""}
          label={field.question}
        />
      )}

      {field.type === "multiple-choice" && (
        <GridItemInput
          colSpan={12}
          name={field.id}
          defaultValue={answer || undefined}
          label={field.question}
          type="select"
          options={field.possibleAnswers.split(",").map((option: string) => ({
            value: option,
            label: option,
          }))}
        />
      )}
      {field.type === "truth-or-false" && (
        <GridItemInput
          colSpan={12}
          name={field.id}
          defaultValue={answer || undefined}
          label={field.question}
          type="select"
          options={field.possibleAnswers.split(",").map((option: string) => ({
            value: option,
            label: option === "v" ? "Verdadero" : "Falso",
          }))}
        />
      )}
    </>
  );
};

export default StudentAnswerForm;
