import {
  useToast,
  GridItem,
  Button,
  Divider,
  VStack,
  HStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { CourseLayout } from "../../../../../layouts/course-layout";
import { eventToFormValues } from "../../../../../utils/eventToFormValues";
import toLocaleISOString from "../../../../../utils/toLocaleISOString";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import TaskFieldForm from "../../../../../components/Forms/TaskFieldForm";
import { Card, CardBody } from "../../../../../components/Card";

interface Props {
  initialTask: any;
  courseId: string;
}

const TaskEditPage = ({ initialTask }: Props) => {
  const toast = useToast();
  const [task, setTask] = useState(initialTask);

  const handleDelete = async (e: any, id: string) => {
    e.preventDefault();

    task.fields = task.fields.filter((field: any) => field.id !== id);

    const insert = {
      dateStart: new Date(task.dateStart),
      dateEnd: new Date(task.dateEnd),
      name: task.name,
      description: task.description,
      courseId: task.courseId,
      fields: {
        deleteMany: {},
        createMany: {
          skipDuplicates: true,
          data: task.fields,
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
        title: "Borrado",
        description: "El campo se ha borrado correctamente",
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
  const handleCreateField = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    let possibleAnswers;
    if (values.type === "text") possibleAnswers = null;
    else if (values.type === "multiple-choice")
      possibleAnswers = values.possibleAnswers;
    else if (values.type === "truth-or-false") possibleAnswers = "v,f";

    const field = {
      type: values.type,
      question: values.question,
      possibleAnswers: possibleAnswers,
      correctAnswer: values.type !== "text" ? values.correctAnswer : null,
      value: parseInt(values.value, 10),
    };
    task.fields.push(field);
    const insert = {
      dateStart: new Date(task.dateStart),
      dateEnd: new Date(task.dateEnd),
      name: task.name,
      description: task.description,
      courseId: task.courseId,
      fields: {
        createMany: {
          skipDuplicates: true,
          data: task.fields,
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
        title: "Actualizada",
        description: "La tarea se ha actualizado correctamente",
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
  const handleUpdateField = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    let possibleAnswers;
    if (values.type === "text") possibleAnswers = null;
    else if (values.type === "multiple-choice")
      possibleAnswers = values.possibleAnswers;
    else if (values.type === "truth-or-false") possibleAnswers = "v,f";

    task.fields = task.fields.filter((field: any) => field.id !== values.id);
    const field = {
      type: values.type,
      question: values.question,
      possibleAnswers: possibleAnswers,
      correctAnswer: values.type !== "text" ? values.correctAnswer : null,
      value: parseInt(values.value, 10),
    };
    task.fields.push(field);
    const insert = {
      dateStart: new Date(task.dateStart),
      dateEnd: new Date(task.dateEnd),
      name: task.name,
      description: task.description,
      courseId: task.courseId,
      fields: {
        deleteMany: {},
        createMany: {
          skipDuplicates: true,
          data: task.fields,
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
        title: "Actualizada",
        description: "La tarea se ha actualizado correctamente",
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

  return (
    <>
      <GridItem colSpan={12}>
        <HStack spacing="4">
          <Text fontSize="2xl" fontWeight="bold" color={"gray.00"}>
            {task.name}
          </Text>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="green"
            size="sm"
            variant="outline"
          >
            Agregar campo
          </Button>
        </HStack>
      </GridItem>
      <GridItem colSpan={12}>
        <Divider />
      </GridItem>
      {task.fields.length > 0 && (
        <GridItem colSpan={12}>
          <Card>
            <CardBody>
              <VStack align="left" spacing={3} divider={<Divider />}>
                {task.fields.map((field: any, index: number) => (
                  <HStack key={index} justify="space-between" w="100%">
                    <VStack align="left">
                      <Text fontWeight="bold" fontSize="md">
                        {field.question}
                      </Text>
                      <Badge colorScheme="green" width="fit-content">
                        {field.type}
                      </Badge>
                    </VStack>
                    <HStack spacing="4">
                      <Button
                        colorScheme="red"
                        size="sm"
                        variant="outline"
                        leftIcon={<DeleteIcon />}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="outline"
                        colorScheme="blue"
                        target="_blank"
                        size="sm"
                        leftIcon={<EditIcon />}
                      >
                        Editar
                      </Button>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
          <TaskFieldForm buttonText="Create" handleSubmit={handleCreateField} />
        </GridItem>
      )}
    </>
  );
};

TaskEditPage.getLayout = function getLayout(page: NextPage) {
  return <CourseLayout>{page}</CourseLayout>;
};

export const getServerSideProps = async (context: any) => {
  const taskId = context.params.id;
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
      courseId: context.params.slug,
    },
  };
};

export default TaskEditPage;
