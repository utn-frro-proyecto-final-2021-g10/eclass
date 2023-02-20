import Link from "next/link";
import { Text, VStack, HStack, Divider, Button } from "@chakra-ui/react";
import { Task, Course } from "@prisma/client";
import { ArrowForwardIcon, EditIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody } from "../../../../Card";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser";

export const TasksList = ({
  tasks,
  course,
}: {
  tasks: Task[];
  course: Course;
}) => {
  const user = useCurrentUser();
  return (
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
                        Editar
                      </Button>
                    </Link>
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
  );
};
