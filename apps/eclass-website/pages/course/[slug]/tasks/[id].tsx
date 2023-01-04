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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card } from "../../../../components/Card";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { FullTask } from "../../../../types/Task";
import { eventToFormValues } from "../../../../utils/eventToFormValues";
import { getFormValues } from "../../../../utils/getFormValues";

interface Props {
  fullTask: FullTask;
  courseId: string;
}

const Task = ({ fullTask }: Props) => {
  const me = useCurrentUser();
  const router = useRouter();
  const [answer, setAnswer] = useState<any | null>(null);

  useEffect(() => {
    let studentAnswers = fullTask.answers.filter(
      (a: any) => a.user.id == me?.id
    );
    if (studentAnswers.length > 0) setAnswer(studentAnswers[0]);
    else setAnswer(null);
  }, [fullTask, me]);

  const handleCorrection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    const answer: any = fullTask.answers[values.AnswerIndex];
    let score = 0
    for (let index = 0; index < answer.fields.length; index++) {
      const field = answer.fields[index];

      field.qualification = parseFloat(values[`${index}-score`]);
      score = score + field.qualification
    }

    const insert = {
      userId: answer.user.id,
      taskId: fullTask.id,
      dateSubmitted: new Date(),
      qualification: score,
      fields: {
        create: answer.fields.map((field: any) => {
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
      `/api/v1/answer/${answer.user.id}/${fullTask.id}/changeAnswer`,
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
      fullTask.fields = fullTask.fields.map((field: Field, index: number) => {
        let newField = field;

        newField.studentAnswer = values[index];
        newField.dateSubmitted = new Date();
        return newField;
      });

      let answer = {
        userId: me?.id,
        taskId: fullTask.id,
        dateSubmitted: new Date(),
        qualification: null,
        fields: {
          create: fullTask.fields.map((field: Field) => {
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
        `/api/v1/answer/${me.id}/${fullTask.id}/changeAnswer`,
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
        <Text> {fullTask.name} </Text>
        <Text> {fullTask.description} </Text>
        {fullTask.dateEnd !== null && (
          <Text> Fecha de entrega: {fullTask.dateEnd} </Text>
        )}

        {fullTask.answers.map((answer: any, index: number) => (
          <form key={index} onSubmit={handleCorrection}>
            <>
              <Card>
                <Input
                  name={`AnswerIndex`}
                  value={index}
                  visibility={"hidden"}
                  width={0}
                  height={0}
                />

                {answer.fields.map((field: any, index: number) => (
                  <>
                    <pre>{answer.user.lastName}</pre>
                    <FormControl>
                      <FormLabel>{field.question}</FormLabel>
                      <Input
                        name={`${index}`}
                        defaultValue={field.studentAnswer?.toString()}
                        readOnly={true}
                        disabled={true}
                      />
                      <NumberInput
                        min={0}
                        max={field.value}
                        name={`${index}-score`}
                        defaultValue={field.qualification}
                      >
                        <NumberInputField
                          placeholder={`Max score: ${field.value}`}
                        />
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

  if (fullTask.dateEnd !== null && fullTask.dateEnd < new Date()) {
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
          <Text> {fullTask.name} </Text>
          <Text> {fullTask.description} </Text>
          {fullTask.dateEnd !== null ?? (
            <Text> Fecha de entrega: {fullTask.dateEnd} </Text>
          )}
          <form onSubmit={handleSubmit}>
            {answer.fields.map((field: any, index: number) => (
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
          <Text> {fullTask.name} </Text>
          <Text> {fullTask.description} </Text>
          {fullTask.dateEnd !== null ?? (
            <Text> Fecha de entrega: {fullTask.dateEnd} </Text>
          )}
          <form onSubmit={handleSubmit}>
            {fullTask.fields.map((field, index) => (
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
  const task: any = await prisma.task.findUnique({
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
    task.answers.sort((a: any, b: any) =>
      a.user.lastName.localeCompare(b.user.lastName)
    );

    return {
      props: {
        fullTask: task,
      },
    };
  }
  return { props: {} };
};

export default Task;
