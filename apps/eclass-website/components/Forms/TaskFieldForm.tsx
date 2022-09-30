import { FormControl, Input, RadioGroup, Radio, FormLabel, NumberInput, NumberInputField, Button } from "@chakra-ui/react"
import { useState } from "react";

interface Props {
    buttonText: string
    field?: any
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
const TaskFieldForm = ({ buttonText, field, handleSubmit }: Props) => {
    const [questionType, setQuestionType] = useState("text")
    return (
        <form onSubmit={handleSubmit}>
            <FormControl>
                <Input name="id" value={field?.id || ""} visibility={"hidden"}></Input>
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
                <Input name="question" defaultValue={field?.question || ""} placeholder="Write your question here. Include options and descriptions if necessary"></Input>
                {questionType !== "text" &&
                    <>
                        {questionType === "multiple-choice" &&
                            <>
                                <FormLabel>Posible Answers</FormLabel>
                                <Input name="possibleAnswers" defaultValue={field?.possibleAnswers || ""} placeholder="Comma separated list of posible answers (a,b,c,d,...)"></Input>
                            </>
                        }
                        <FormLabel>Answer</FormLabel>
                        <Input name="correctAnswer" defaultValue={field?.correctAnswer || ""}></Input>
                    </>
                }
                <FormLabel>Value</FormLabel>
                <NumberInput name="value" min={0} defaultValue={field?.value || ""}>
                    <NumberInputField />
                </NumberInput>
            </FormControl>
            <Button type="submit">{buttonText}</Button>
        </form>
    )
}

export default TaskFieldForm