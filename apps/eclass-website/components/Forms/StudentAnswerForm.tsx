import { FormLabel, Input, RadioGroup, Radio } from "@chakra-ui/react";
import field from "../../pages/api/v1/field";

interface Props {
  field: any
  answer?: string
}
const StudentAnswerForm = ({ field, answer }: Props) => {
  return (
    <>
      <FormLabel >{field.question}</FormLabel>
      {field.type === "text" && <Input name={field.id} defaultValue={answer || ""}></Input>}
      {field.type !== "text" &&
        <>
          <RadioGroup name={field.id} defaultValue={answer || ""}>
            {field.possibleAnswers.split(',').map((answer: string, index: number) => <Radio key={index} value={answer}>{answer}</Radio>)}
          </RadioGroup>
        </>
      }
    </>);
}

export default StudentAnswerForm
