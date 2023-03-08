import { Button, HStack, useDisclosure, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { CreateAndEditTask } from "../CreateAndEditTask";
import { Course } from "@prisma/client";
import { eventToFormValues } from "../../../../../utils/eventToFormValues";
import { useQueryClient } from "react-query";

interface Props {
  course: Course;
}

export const TaskForm = ({ course }: Props) => {
  const { onClose, onOpen, isOpen } = useDisclosure();
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    const task = {
      name: values.name,
      description: values.description,
      dateStart: new Date(values.dateStart) || null,
      dateEnd: new Date(values.dateEnd),
      course: {
        connect: {
          id: course.id,
        },
      },
    };

    if (task.dateEnd < task.dateStart) {
      toast({
        title: "Error",
        description: "La fecha de fin debe ser posterior a la fecha de inicio",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const result = await fetch(`/api/v1/task`, {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status === 200) {
      toast({
        title: "Creada",
        description: "La tarea ha sido creada con éxito",
        status: "success",
        isClosable: true,
      });

      onClose();
      queryClient.invalidateQueries("current-course");
    } else {
      toast({
        title: "Error",
        description: "Error al crear la tarea",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <HStack spacing={4}>
        <Button
          onClick={onOpen}
          leftIcon={<AddIcon />}
          colorScheme="green"
          size="sm"
        >
          Añadir nueva tarea
        </Button>
      </HStack>
      <CreateAndEditTask
        isOpen={isOpen}
        onClose={onClose}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
