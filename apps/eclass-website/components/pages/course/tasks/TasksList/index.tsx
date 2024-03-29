import Link from "next/link";
import {
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  useDisclosure,
  useToast,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  IconButton,
} from "@chakra-ui/react";
import { Task, Course } from "@prisma/client";
import {
  ArrowForwardIcon,
  DeleteIcon,
  EditIcon,
  InfoIcon,
  QuestionIcon,
} from "@chakra-ui/icons";
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

    if (updatedTask.dateEnd <= updatedTask.dateStart) {
      toast({
        title: "Error",
        description: "La fecha de fin debe ser posterior a la fecha de inicio",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const result = await fetch(`/api/v1/task/${taskToEdit?.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const success = result.status === 200;

    toast({
      title: success ? "Éxito" : "Error",
      description: success
        ? "La tarea se ha actualizado correctamente"
        : "Error al actualizar la tarea",
      status: success ? "success" : "error",
      isClosable: true,
    });

    if (success) {
      queryClient.invalidateQueries("current-course");
      onClose();
    }
  };

  const handleRemoveTask = async (taskToEdit: Task) => {
    const result = await fetch(`/api/v1/task/${taskToEdit?.id}`, {
      method: "DELETE",
    });

    const success = result.status === 200;

    toast({
      title: success ? "Éxito" : "Error",
      description: success
        ? "La tarea se ha eliminado correctamente"
        : "Error al eliminar la tarea",
      status: success ? "success" : "error",
      isClosable: true,
    });

    if (success) {
      queryClient.invalidateQueries("current-course");
      onClose();
    }
  };

  const onEditTask = (task: Task) => {
    setTaskToEdit(task);
    onOpen();
  };

  const handlePublishTask = async (taskToEdit: Task, published: boolean) => {
    const result = await fetch(`/api/v1/task/${taskToEdit?.id}`, {
      method: "PUT",
      body: JSON.stringify({ published }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const success = result.status === 200;

    toast({
      title: success ? "Éxito" : "Error",
      description: success
        ? `La tarea se ha ${
            published ? "publicado" : "despublicado"
          } correctamente`
        : `Error al ${published ? "publicar" : "despublicar"} la tarea`,
      status: success ? "success" : "error",
      isClosable: true,
    });

    if (success) {
      queryClient.invalidateQueries("current-course");
    }
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
                  <VStack align="left">
                    <HStack>
                      <Text fontWeight="bold" fontSize="md">
                        {task.name}
                      </Text>
                      <Popover>
                        <PopoverTrigger>
                          <IconButton
                            aria-label="Mas info"
                            icon={<InfoIcon />}
                            rounded="full"
                            size="xs"
                            variant="ghost"
                          />
                        </PopoverTrigger>
                        <PopoverContent w="fit-content">
                          <PopoverHeader fontWeight="semibold">
                            Datos de la tarea
                          </PopoverHeader>
                          <PopoverBody>
                            <VStack align="left">
                              <Text fontSize="sm">
                                Fecha de inicio:{" "}
                                <Badge colorScheme="green">
                                  {new Date(
                                    // @ts-ignore
                                    task.dateStart
                                  ).toLocaleDateString()}
                                </Badge>
                              </Text>
                              <Text fontSize="sm">
                                Fecha de entrega:{" "}
                                <Badge colorScheme="red">
                                  {
                                    // @ts-ignore
                                    new Date(task.dateEnd).toLocaleDateString()
                                  }
                                </Badge>
                              </Text>
                            </VStack>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                      {user?.role === "professor" && (
                        <>
                          {" "}
                          <Badge colorScheme={task.published ? "green" : "red"}>
                            {task.published ? "Publicada" : "No publicada"}
                          </Badge>
                          {/* @ts-ignore */}
                          {new Date(task.dateStart) > new Date() && (
                            <Badge colorScheme="yellow">Pendiente</Badge>
                          )}
                          {/* @ts-ignore */}
                          {new Date(task.dateStart) < new Date() &&
                            // @ts-ignore
                            new Date(task.dateEnd) > new Date() && (
                              <Badge colorScheme="blue">En curso</Badge>
                            )}
                          {/* @ts-ignore */}
                          {new Date(task.dateEnd) < new Date() && (
                            <Badge colorScheme="orange">Finalizada</Badge>
                          )}
                        </>
                      )}
                    </HStack>
                    <Text fontSize="sm">{task.description}</Text>
                  </VStack>

                  <HStack>
                    {user?.role === "professor" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => handleRemoveTask(task)}
                        >
                          Eliminar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<EditIcon />}
                          colorScheme="blue"
                          onClick={() => onEditTask(task)}
                        >
                          Editar
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
                            leftIcon={<QuestionIcon />}
                            colorScheme="yellow"
                          >
                            Editar preguntas y respuestas
                          </Button>
                        </Link>
                      </>
                    )}
                    {user?.role === "professor" && (
                      <Button
                        outline="none"
                        size="sm"
                        variant={task.published ? "outline" : "solid"}
                        colorScheme="pink"
                        onClick={() => handlePublishTask(task, !task.published)}
                      >
                        {task.published ? "Despublicar" : "Publicar"}
                      </Button>
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
                        disabled={task.published === false}
                        pointerEvents={
                          task.published === false ? "none" : "auto"
                        }
                      >
                        {user?.role === "professor"
                          ? "Ver respuestas"
                          : "Responder"}
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
      <CreateAndEditTask
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleEditTask}
        taskToEdit={taskToEdit}
      />
    </>
  );
};
