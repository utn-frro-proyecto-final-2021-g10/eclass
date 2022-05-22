import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Text,
} from "@chakra-ui/react";
import { Answer, Field } from "@prisma/client";
import type { NextPage } from "next";
import router from "next/router";
import { useEffect, useState } from "react";
import { Card } from "../../../../components/Card";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { CourseLayout } from "../../../../layouts/course-layout";
import { FullTask } from "../../../../types/Task";
import { getFormValues } from "../../../../utils/getFormValues";

const Task: NextPage<{ task: FullTask }> = (fullTask) => {
  const me = useCurrentUser();
  const [answer, setAnswer] = useState<Answer | null>(null);
  useEffect(() => {
    let studentAnswers = fullTask.task.answers.filter(
      (a) => a.user.id == me?.id
    );
    if (studentAnswers.length > 0) setAnswer(studentAnswers[0]);
    else setAnswer(null);
  }, [fullTask, fullTask.task, me]);
  const handleCorrection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);

    let answer = fullTask.task.answers[values.AnswerIndex];
    console.log(`index: ${values.AnswerIndex}`);

    for (let index = 0; index < answer.fields.length; index++) {
      const field = answer.fields[index];
      field.qualification = parseFloat(values[`${index}-score`]);
    }

    let insert = {
      userId: answer.user.id,
      taskId: fullTask.task.id,
      dateSubmitted: new Date(),
      qualification: null,
      fields: {
        create: answer.fields.map((field) => {
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

    const result = await fetch(
      `/api/v1/answer/${answer.user.id}/${fullTask.task.id}/changeAnswer`,
      {
        method: "POST",
        body: JSON.stringify(insert),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await result.json();
    if (response.success) {
      router.reload();
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);

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

      const result = await fetch(
        `/api/v1/answer/${me.id}/${fullTask.task.id}/changeAnswer`,
        {
          method: "POST",
          body: JSON.stringify(answer),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await result.json();
      if (res.success) {
        router.reload();
      }
    }
  };

  if (me?.role == "professor") {
    return (
      <>
        <Text> {fullTask.task.name} </Text>
        <Text> {fullTask.task.description} </Text>
        {fullTask.task.dateEnd !== null && (
          <Text> Fecha de entrega: {fullTask.task.dateEnd} </Text>
        )}

        {fullTask.task.answers.map((answer, index) => (
          // eslint-disable-next-line react/jsx-key
          <form onSubmit={handleCorrection}>
            <>
              <Card>
                <Input
                  name={`AnswerIndex`}
                  value={index}
                  visibility={"hidden"}
                  width={0}
                  height={0}
                />

                {answer.fields.map((field, index) => (
                  <>
                    <pre>{answer.user.lastName}</pre>
                    <FormControl>
                      <FormLabel>{field.question}</FormLabel>
                      <Input
                        name={`${index}`}
                        defaultValue={field.studentAnswer?.toString()}
                        readOnly={true}
                      />
                      <NumberInput
                        min={0}
                        max={field.value}
                        name={`${index}-score`}
                        placeholder={`Max score: ${field.value}`}
                        defaultValue={field.qualification}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                  </>
                ))}
                <Button type="submit">Submit</Button>
              </Card>
            </>
          </form>
        ))}
      </>
    );
  }

  if (
    fullTask.task.dateEnd !== null &&
    Date.parse(fullTask.task.dateEnd) < new Date()
  ) {
    return (
      <>
        <Box>
          <Text> Esta tarea ya ha terminado </Text>
        </Box>
      </>
    );
  }
  return (
    <>
      {answer !== null ? (
        <>
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
                    defaultValue={field.studentAnswer?.toString()}
                  />
                </FormControl>
              </>
            ))}
            <Button type="submit">Submit</Button>
          </form>
        </>
      ) : (
        <>
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
// @ts-ignore
Task.getLayout = function getLayout(page: ReactElement) {
  return <CourseLayout>{page}</CourseLayout>;
};
export const getServerSideProps = async (context: any) => {
  const task = await prisma.task.findUnique({
    where: {
      id: context.params.id,
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
              qualification: true,
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
              profileImageUrl: true,
              email: true,
              id: true,
            },
          },
        },
      },
    },
  });

  if (task) {
    if (task.dateEnd !== null) {
      task.dateEnd = task.dateEnd?.toString();
    }
    if (task.dateStart !== null) {
      task.dateStart = task.dateStart?.toString();
    }
    task.answers.sort((a, b) => a.user.lastName.localeCompare(b.user.lastName));

    return { props: { task } };
  }
  return { props: {} };
};

export default Task;
