import {
  useToast,
  GridItem,
  Button,
  Divider,
  HStack,
  Text,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { CourseLayout } from "../../../../../layouts/course-layout";
import { eventToFormValues } from "../../../../../utils/eventToFormValues";
import toLocaleISOString from "../../../../../utils/toLocaleISOString";
import { AddIcon } from "@chakra-ui/icons";
import { Card, CardBody } from "../../../../../components/Card";
import { CreateAndEditField } from "../../../../../components/pages/course/tasks/CreateAndEditField";
import { FieldsList } from "../../../../../components/pages/course/tasks/FieldsList";
import { useCurrentCourse } from "../../../../../hooks/useCurrentCourse";

interface Props {
  initialTask: any;
  courseSlug: string;
}

const TaskEditPage = ({ initialTask, courseSlug }: Props) => {
  useCurrentCourse(courseSlug);
  const toast = useToast();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const {
    onClose: onCloseField,
    onOpen: onOpenField,
    isOpen: isOpenField,
  } = useDisclosure();
  const [task, setTask] = useState(initialTask);
  const [fieldToEdit, setFieldToEdit] = useState<Field | null>(null);

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

        onClose();
      }
    } else {
      toast({
        title: "Error",
        description: JSON.stringify(await result.json(), null, 2),
        status: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
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
        title: "Eliminado",
        description: "El campo se ha eliminado correctamente",
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

    const index = task.fields.findIndex((field: any) => field.id === values.id);

    const field = {
      type: values.type,
      question: values.question,
      possibleAnswers: possibleAnswers,
      correctAnswer: values.type !== "text" ? values.correctAnswer : null,
      value: parseInt(values.value, 10),
    };

    task.fields.splice(index, 1, field);

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
        description: "La pregunta se ha actualizado correctamente",
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
        onCloseField();
      }
    } else {
      toast({
        title: "Error",
        description: JSON.stringify(await result.json(), null, 2),
        status: "error",
      });
    }
  };

  const onEditField = (field: Field) => {
    setFieldToEdit(field);
    onOpenField();
  };

  return (
    <>
      <CreateAndEditField
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleCreateField}
      />
      <CreateAndEditField
        isOpen={isOpenField}
        onClose={onCloseField}
        handleSubmit={handleUpdateField}
        fieldToEdit={fieldToEdit}
      />
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
            onClick={onOpen}
          >
            Añadir pregunta
          </Button>
        </HStack>
        <GridItem colSpan={12} mt={4}>
          <Text color={"gray.700"}>{task.description}</Text>
        </GridItem>
      </GridItem>
      <GridItem colSpan={12}>
        <Divider />
      </GridItem>
      {task.fields.length > 0 && (
        <>
          <GridItem colSpan={12}>
            <HStack spacing="6">
              <Text>
                Cantidad de preguntas:{" "}
                <Badge colorScheme="cyan">{task.fields.length}</Badge>
              </Text>
              <Text>
                Puntaje total:{" "}
                <Badge colorScheme="cyan">
                  {task.fields.reduce(
                    (acc: number, field: any) => acc + field.value,
                    0
                  )}
                </Badge>
              </Text>
            </HStack>
          </GridItem>
          <GridItem colSpan={12}>
            <Card>
              <CardBody>
                <FieldsList
                  task={task}
                  onEdit={onEditField}
                  onDelete={handleDelete}
                />
              </CardBody>
            </Card>
          </GridItem>
        </>
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

  const courseSlug = context.params.slug;

  return {
    props: {
      initialTask: task,
      courseSlug,
    },
  };
};

export default TaskEditPage;
