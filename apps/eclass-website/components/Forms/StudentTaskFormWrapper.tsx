import { FormControl, Button } from "@chakra-ui/react";
import StudentAnswerForm from "./StudentAnswerForm";

interface Props {
    myAnswer: any
    task: any
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
const StudentTaskFormWrapper = ({ handleSubmit, myAnswer, task }: Props) => {
    return (
        <form onSubmit={handleSubmit}>
            <FormControl>
                {myAnswer ?
                    myAnswer.fields.map((field: any, index: number) => (
                        <StudentAnswerForm key={`f-${index}`} field={field} answer={field.studentAnswer} />
                    )) :
                    task.fields.map((field: any, index: number) => (
                        <>
                            <StudentAnswerForm key={`f-${index}`} field={field} />
                        </>
                    ))}
                <Button type="submit">Aceptar</Button>
            </FormControl>
        </form>
    )
}

export default StudentTaskFormWrapper