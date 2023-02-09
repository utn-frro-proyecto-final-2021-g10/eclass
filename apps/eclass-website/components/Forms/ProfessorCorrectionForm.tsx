import {
    FormControl,
    Input,
    FormLabel,
    RadioGroup,
    Radio,
    NumberInput,
    NumberInputField,
    Button
} from "@chakra-ui/react"

interface Props {
    task: any
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleAutoCorrection: (e: any, formName: string) => Promise<void>;
}
const ProfessorCorrectionForm = ({ handleSubmit, handleAutoCorrection, task }: Props) => {
    return (
        <>
            {task.answers.map((answer: any, index: number) => (
                <>
                    {`Student: ${answer?.user.firstName} ${answer?.user.lastName}`}
                    <form name={`form-${index}`} key={index} onSubmit={handleSubmit}>
                        <FormControl>
                            <Input visibility={"hidden"} readOnly={true} name="studentId" value={answer.userId}></Input>
                            {answer.fields.map((field: any) => (
                                <>
                                    <FormLabel>{field.question}</FormLabel>
                                    {field.type === "text" && <Input name={field.id} value={field.studentAnswer}></Input>}
                                    {field.type !== "text" &&
                                        <>
                                            <RadioGroup name={field.id} value={field.studentAnswer}>
                                                {field.possibleAnswers.split(',').map((answer: string, index: number) => <Radio key={index} value={answer}>{answer}</Radio>)}
                                            </RadioGroup>
                                        </>
                                    }
                                    <FormLabel>Score</FormLabel>
                                    <NumberInput name={`${field.id}-qualification`} min={0} max={field.value} defaultValue={field?.qualification}>
                                        <NumberInputField placeholder={`0 - ${field.value}`} />
                                    </NumberInput>
                                </>
                            ))}
                            <Button type="submit">Submit</Button>
                            <Button onClick={(e) => handleAutoCorrection(e, `form-${index}`)}>AutoCorrect</Button>
                        </FormControl>
                    </form>
                </>
            ))
            }
        </>
    )
}

export default ProfessorCorrectionForm