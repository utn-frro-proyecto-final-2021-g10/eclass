import {
  FormControl,
  Input,
  RadioGroup,
  Radio,
  FormLabel,
  NumberInput,
  NumberInputField,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  buttonText: string;
  field?: any;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDelete?: (e: any) => Promise<void>;
}
const TaskFieldForm = ({
  buttonText,
  field,
  handleSubmit,
  handleDelete,
}: Props) => {
  const [questionType, setQuestionType] = useState(field?.type || "text");
  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Input
            name="id"
            value={field?.id || ""}
            visibility={"hidden"}
          ></Input>
          <RadioGroup
            name="type"
            defaultValue={field?.type || questionType}
            onChange={(e) => setQuestionType(e)}
          >
            <Radio value={"text"}>Text</Radio>
            <Radio value={"multiple-choice"}>Multiple Choice</Radio>
            <Radio value={"truth-or-false"}>Truth or False</Radio>
          </RadioGroup>
          <FormLabel>Question</FormLabel>
          <Input
            name="question"
            defaultValue={field?.question || ""}
            placeholder="Write your question here. Include options and descriptions if necessary"
          ></Input>
          {questionType !== "text" && (
            <>
              {questionType === "multiple-choice" && (
                <>
                  <FormLabel>Posibles Respuestas</FormLabel>
                  <Input
                    name="possibleAnswers"
                    defaultValue={field?.possibleAnswers || ""}
                    placeholder="Comma separated list of posible answers (a,b,c,d,...)"
                  ></Input>
                </>
              )}
              <FormLabel>Respuesta</FormLabel>
              {questionType === "truth-or-false" ? (
                <Input
                  name="correctAnswer"
                  defaultValue={field?.correctAnswer || ""}
                  placeholder="v or f"
                ></Input>
              ) : (
                <Input
                  name="correctAnswer"
                  defaultValue={field?.correctAnswer || ""}
                ></Input>
              )}
            </>
          )}
          <FormLabel>Valor</FormLabel>
          <NumberInput name="value" min={0} defaultValue={field?.value || ""}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <Button type="submit">{buttonText}</Button>
      </form>
      {field && <Button onClick={handleDelete}>Eliminar</Button>}
    </>
  );
};

export default TaskFieldForm;
