import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { Answer, Field } from "@prisma/client";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { FullTask } from "../../../../types/Task";
import { getFormValues } from "../../../../utils/getFormValues";

const Task: NextPage<{ task: FullTask }> = (fullTask) => {
  const me = useCurrentUser();
  const [answer, setAnswer] = useState<Answer | null>(null);
  useEffect(() => {
    let studentAnswer = fullTask.task.answers.filter(
      (a) => a.userId == me?.id
    )[0];
    studentAnswer !== undefined && setAnswer(studentAnswer);
  }, [fullTask, me]);

  console.log("Answer: " + answer);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);

    console.log(JSON.stringify(values));

    if (me) {
      fullTask.task.fields = fullTask.task.fields.map((field: Field, index) => {
        let newField = field;

        newField.studentAnswer = values[index];
        newField.dateSubmitted = new Date();
        return newField;
      });

      let answer = {
        userId: me?.id,
        taskId: fullTask.task.id,
        dateSubmitted: new Date(),
        qualification: null,
        fields: {
          create: fullTask.task.fields.map((field) => {
            return {
              type: field.type,
              question: field.question,
              correctAnswer: field.correctAnswer,
              value: field.value,
              studentAnswer: field.studentAnswer,
              dateSubmitted: field.dateSubmitted,
              qualification: field.qualification,
              taskId: field.taskId,
            };
          }),
        },
      };

      const result = await fetch("/api/v1/answer", {
        method: "POST",
        body: JSON.stringify(answer),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await result.json();
      console.log(`RESULT : ${JSON.stringify(res)}`);
    }
  };

  return (
    <>
      {answer !== null ? (
        <>
          <pre>{JSON.stringify(answer, null, 2)}</pre>
          <Text> {fullTask.task.name} </Text>
          <Text> {fullTask.task.description} </Text>
          {fullTask.task.dateEnd !== null ?? (
            <Text> Fecha de entrega: {fullTask.task.dateEnd} </Text>
          )}
          <form onSubmit={handleSubmit}>
            {answer.fields.map((field, index) => (
              <>
                <FormControl>
                  <FormLabel>{field.question}</FormLabel>
                  <Input
                    name={`${index}`}
                    value={field.studentAnswer?.toString()}
                  />
                </FormControl>
              </>
            ))}
            <Button type="submit">Submit</Button>
          </form>
        </>
      ) : (
        <>
          {/* <pre>{JSON.stringify(fullTask, null, 2)}</pre> */}
          <Text> {fullTask.task.name} </Text>
          <Text> {fullTask.task.description} </Text>
          {fullTask.task.dateEnd !== null ?? (
            <Text> Fecha de entrega: {fullTask.task.dateEnd} </Text>
          )}
          <form onSubmit={handleSubmit}>
            {fullTask.task.fields.map((field, index) => (
              <>
                <FormControl>
                  <FormLabel>{field.question}</FormLabel>
                  <Input name={`${index}`} />
                </FormControl>
              </>
            ))}
            <Button type="submit">Submit</Button>
          </form>
        </>
      )}
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const task = await prisma.task.findUnique({
    where: {
      id: context.params.taskId,
    },
    include: {
      fields: {
        select: {
          studentAnswer: true,
          question: true,
          id: true,
          type: true,
          value: true,
        },
      },
      answers: {
        select: {
          fields: {
            select: {
              studentAnswer: true,
              question: true,
              id: true,
              type: true,
              value: true,
            },
          },
        },
      },
    },
  });

  if (task) {
    return { props: { task } };
  }
  return { props: {} };
};

export default Task;
