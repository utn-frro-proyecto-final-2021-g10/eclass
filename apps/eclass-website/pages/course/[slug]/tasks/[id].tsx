import { GridItem, Divider, HStack, Text, useToast } from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import ProfessorCorrectionForm from "../../../../components/Forms/ProfessorCorrectionForm";
import StudentTaskFormWrapper from "../../../../components/Forms/StudentTaskFormWrapper";
import { useCurrentCourse } from "../../../../hooks/useCurrentCourse";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { CourseLayout } from "../../../../layouts/course-layout";
import { eventToFormValues } from "../../../../utils/eventToFormValues";
import { getFormValues } from "../../../../utils/getFormValues";
import toLocaleISOString from "../../../../utils/toLocaleISOString";

interface Props {
  initialTask: any;
  courseSlug: string;
}
const Task = ({ initialTask, courseSlug }: Props) => {
  useCurrentCourse(courseSlug);
  const me = useCurrentUser();
  const toast = useToast();
  const [task, setTask] = useState(initialTask);
  const [myAnswer, setMyAnswer] = useState<any>(null);

  const handleAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    const fields = new Array();
    for (const [key, value] of Object.entries(values)) {
      let field = myAnswer
        ? myAnswer.fields.filter((field: any) => field.id === key)[0]
        : task.fields.filter((field: any) => field.id === key)[0];

      field.studentAnswer = value;
      field.dateSubmitted = new Date();
      delete field.id;
      fields.push(field);
    }
    const insert = {
      answers: {
        upsert: {
          where: {
            userId_taskId: {
              taskId: task.id,
              userId: me?.id,
            },
          },
          create: {
            fields: {
              createMany: {
                data: fields,
              },
            },
            dateSubmitted: new Date(),
            user: {
              connect: {
                id: me?.id,
              },
            },
          },
          update: {
            fields: {
              deleteMany: {},
              createMany: {
                data: fields,
              },
            },
            dateSubmitted: new Date(),
            user: {
              connect: {
                id: me?.id,
              },
            },
          },
        },
      },
    };
    const result = await fetch(`/api/v1/task/${initialTask.id}`, {
      method: "PUT",
      body: JSON.stringify(insert),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      toast({
        title: "Éxito",
        description: "La tarea se respondió correctamente",
        status: "success",
      });
      const taskResult = await fetch(`/api/v1/task/${initialTask.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (taskResult.status === 200) {
        const data = await taskResult.json();
        setTask(data.task);
      }
    } else {
      toast({
        title: "Error",
        description: JSON.stringify(await result.json(), null, 2),
        status: "error",
      });
    }
  };

  const handleCorrection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);
    const answer = task.answers.filter(
      (answer: any) => answer.userId == values.studentId
    )[0];
    answer.fields.forEach((field: any) => {
      field.qualification = parseInt(values[`${field.id}-qualification`]);
    });

    const update = {
      answers: {
        update: {
          where: {
            userId_taskId: {
              taskId: task.id,
              userId: values.studentId,
            },
          },
          data: {
            fields: {
              deleteMany: {},
              createMany: {
                data: answer.fields,
              },
            },
          },
        },
      },
    };
    const result = await fetch(`/api/v1/task/${initialTask.id}`, {
      method: "PUT",
      body: JSON.stringify(update),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      toast({
        title: "Éxito",
        description: "La tarea se corrigió correctamente",
        status: "success",
      });
      const taskResult = await fetch(`/api/v1/task/${initialTask.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (taskResult.status === 200) {
        const data = await taskResult.json();
        setTask(data.task);
      }
    } else {
      toast({
        title: "Error",
        description: JSON.stringify(await result.json(), null, 2),
        status: "error",
      });
    }
  };

  const handleAutoCorrection = async (e: any, formName: string) => {
    e.preventDefault();
    const form = document.forms.namedItem(formName);
    if (!form) return;
    const data = new FormData(form);
    const values = getFormValues(data);
    const answer = task.answers.filter(
      (answer: any) => answer.userId == values.studentId
    )[0];
    answer.fields.forEach((field: any) => {
      if (field.type !== "text") {
        field.qualification =
          field.studentAnswer === field.correctAnswer ? field.value : 0;
      }
    });
    const update = {
      answers: {
        update: {
          where: {
            userId_taskId: {
              taskId: task.id,
              userId: values.studentId,
            },
          },
          data: {
            fields: {
              deleteMany: {},
              createMany: {
                data: answer.fields,
              },
            },
          },
        },
      },
    };
    const result = await fetch(`/api/v1/task/${initialTask.id}`, {
      method: "PUT",
      body: JSON.stringify(update),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      toast({
        title: "Éxito",
        description: "La tarea se corrigió correctamente",
        status: "success",
      });
      const taskResult = await fetch(`/api/v1/task/${initialTask.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (taskResult.status === 200) {
        const data = await taskResult.json();
        setTask(data.task);
        // @ts-ignore
        form.reset();
      }
    } else {
      toast({
        title: "Error",
        description: JSON.stringify(await result.json(), null, 2),
        status: "error",
      });
    }
  };

  useEffect(() => {
    if (!task || !task.answers) return;
    const myAnswer = task.answers.filter(
      (answer: any) => answer.userId == me?.id
    )[0];

    setMyAnswer(myAnswer);
  }, [me?.id, task]);

  return (
    <>
      <GridItem colSpan={12}>
        <HStack spacing="4">
          <Text fontSize="2xl" fontWeight="bold" color={"gray.00"}>
            {task.name}
          </Text>
        </HStack>
        <GridItem colSpan={12} mt={4}>
          <Text color={"gray.700"}>{task.description}</Text>
        </GridItem>
      </GridItem>
      <GridItem colSpan={12}>
        <Divider />
      </GridItem>

      <GridItem colSpan={12}>
        {me?.role === "student" ? (
          <StudentTaskFormWrapper
            handleSubmit={handleAnswer}
            task={task}
            myAnswer={myAnswer}
          />
        ) : (
          <>
            {task.answers.length > 0 ? (
              <ProfessorCorrectionForm
                handleSubmit={handleCorrection}
                handleAutoCorrection={handleAutoCorrection}
                task={task}
              />
            ) : (
              <Text color={"gray.500"}>
                Hasta el momento, ningún estudiante ha respondido esta tarea.
              </Text>
            )}
          </>
        )}
      </GridItem>
    </>
  );
};

Task.getLayout = function getLayout(page: NextPage) {
  return <CourseLayout>{page}</CourseLayout>;
};

export const getServerSideProps = async (context: any) => {
  const taskId = context.params.id;
  const courseSlug = context.params.slug;

  let task: any = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      fields: {
        select: {
          type: true,
          question: true,
          possibleAnswers: true,
          correctAnswer: true,
          value: true,
          id: true,
        },
      },
      answers: {
        select: {
          fields: {
            select: {
              type: true,
              question: true,
              possibleAnswers: true,
              studentAnswer: true,
              correctAnswer: true,
              value: true,
              id: true,
              qualification: true,
            },
          },
          taskId: true,
          userId: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  task.dateStart =
    task.dateStart !== null
      ? toLocaleISOString(task.dateStart).substring(0, 16)
      : null;
  task.dateEnd = toLocaleISOString(task.dateEnd).substring(0, 16) || null;

  return {
    props: {
      initialTask: task,
      courseSlug,
    },
  };
};

export default Task;
