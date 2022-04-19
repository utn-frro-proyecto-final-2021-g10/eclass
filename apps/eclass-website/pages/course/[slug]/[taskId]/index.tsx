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
import { isTargetLikeServerless } from "next/dist/server/config";
import router from "next/router";
import { useEffect, useState } from "react";
import { Card } from "../../../../components/Card";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
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
    for (let index = 0; index < answer.fields.length; index++) {
      const field = answer.fields[index];
      field.qualification = parseFloat(values[`${index}-score`]);
    }

    let insert = {
      userId: answer.user.id,
      taskId: fullTask.task.id,
      dateSubmitted: answer.dateSubmitted,
      qualification: null,
      // task: {
      //   id: "cl26ns2yf01349wvrzif7i1bo",
      //   dateStart: null,
      //   dateEnd: null,
      //   name: "Tarea1",
      //   description: "Descripcion",
      //   courseId: "cl26njaml0024mwvrggirpj60",
      // },
      fields: answer.fields,
      // [
      //   {
      //     id: "cl26qsm2z12669wvrjouja6fk",
      //     type: "writing",
      //     question: "Pregunta 1",
      //     correctAnswer: null,
      //     value: 100,
      //     studentAnswer: "Respuesta a pregunta 2",
      //     dateSubmitted: "2022-04-19T22:53:32.368Z",
      //     qualification: null,
      //     taskId: null,
      //     answerUserId: "cl26njb0j0207mwvrai8zevrg",
      //     answerTaskId: "cl26ns2yf01349wvrzif7i1bo",
      //   },
      // ],
    };
    insert = {
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

    console.log(JSON.stringify(fullTask.task));
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
    console.log(`RESPUESTA: ${JSON.stringify(response)}`);
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
                      <FormControl>
                      <FormLabel>{field.question}</FormLabel>
                      <Input
                        name={`${index}`}
                        defaultValue={field.studentAnswer?.toString()}
                        readOnly={true}
                      />
                      <Input
                        min={0}
                        max={field.value}
                        name={`${index}-score`}
                        placeholder={`Max score: ${field.value}`}
                        defaultValue={field.qualification}
                      />
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
    return { props: { task } };
  }
  return { props: {} };
};

export default Task;
