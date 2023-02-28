import { Button, GridItem, Grid } from "@chakra-ui/react";
import { CardBody, Card } from "../Card";

import StudentAnswerForm from "./StudentAnswerForm";

interface Props {
  myAnswer: any;
  task: any;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
const StudentTaskFormWrapper = ({ handleSubmit, myAnswer, task }: Props) => {
  return (
    <GridItem colSpan={12}>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <Grid gap={4} w="100%">
              {myAnswer
                ? myAnswer.fields.map((field: any, i: number) => (
                    <StudentAnswerForm
                      key={i}
                      field={field}
                      answer={field.studentAnswer}
                    />
                  ))
                : task.fields.map((field: any, i: number) => (
                    <StudentAnswerForm key={i} field={field} />
                  ))}
              <GridItem colSpan={12}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  ml="auto"
                >
                  Enviar
                </Button>
              </GridItem>
            </Grid>
          </form>
        </CardBody>
      </Card>
    </GridItem>
  );
};

export default StudentTaskFormWrapper;
