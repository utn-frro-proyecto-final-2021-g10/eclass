import Link from "next/link";
import {
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Task, Course } from "@prisma/client";
import { ArrowForwardIcon, EditIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody } from "../../../../Card";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser";
import { CreateAndEditTask } from "../CreateAndEditTask";
import { useState } from "react";
import { eventToFormValues } from "../../../../../utils/eventToFormValues";
import { useQueryClient } from "react-query";

export const TasksList = ({
  tasks,
  course,
}: {
  tasks: Task[];
  course: Course;
}) => {
  console.log(tasks[0]);
  
  const user = useCurrentUser();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    const updatedTask = {
      name: values.name,
      description: values.description,
      dateStart: new Date(values.dateStart) || null,
      dateEnd: new Date(values.dateEnd),
    };

    const result = await fetch(`/api/v1/task/${taskToEdit?.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const success = result.status === 200;

    toast({
      title: success ? "Exito" : "Error",
      description: success
        ? "la tarea se ha actualizado correctamente"
        : "Error al actualizar la tarea",
      status: success ? "success" : "error",
      isClosable: true,
    });

    if (success) {
      queryClient.invalidateQueries("current-course");
      onClose();
    }
  };

  const onEditTask = (course: Task) => {
    setTaskToEdit(course);
    onOpen();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <HStack spacing="2">
            <Text fontSize="xl">Tareas</Text>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack align="left" spacing={3} divider={<Divider />}>
            {tasks?.length > 0 ? (
              tasks.map((task, i) => (
                <HStack key={i} justify="space-between">
                  <VStack align="left" spacing="0">
                    <Text fontWeight="bold" fontSize="md">
                      {task.name}
                    </Text>
                    <Text fontSize="sm">{task.description}</Text>
                  </VStack>

                  <HStack>
                    {user?.role === "professor" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<EditIcon />}
                          colorScheme="blue"
                          onClick={() => onEditTask(task)}
                        >
                          Editar tarea
                        </Button>
                        <Link
                          href={`/course/${course.slug}/tasks/edit/${task.id}`}
                          passHref
                        >
                          <Button
                            as="a"
                            outline="none"
                            size="sm"
                            variant="outline"
                            leftIcon={<EditIcon />}
                            colorScheme="yellow"
                          >
                            Editar preguntas y respuestas
                          </Button>
                        </Link>
                      </>
                    )}
                    <Link
                      href={`/course/${course.slug}/tasks/${task.id}`}
                      passHref
                    >
                      <Button
                        as="a"
                        outline="none"
                        size="sm"
                        variant="solid"
                        colorScheme="green"
                        leftIcon={<ArrowForwardIcon />}
                      >
                        Ver tarea
                      </Button>
                    </Link>
                  </HStack>
                </HStack>
              ))
            ) : (
              <Text>No hay tareas en el curso</Text>
            )}
          </VStack>
        </CardBody>
      </Card>
      {console.log(taskToEdit)}
      <CreateAndEditTask
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleEditTask}
        taskToEdit={taskToEdit}
      />
    </>
  );
};
