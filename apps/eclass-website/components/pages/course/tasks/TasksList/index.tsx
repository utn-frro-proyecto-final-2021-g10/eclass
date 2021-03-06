import { Text, VStack, HStack, Divider, IconButton } from "@chakra-ui/react";
import { Task, Course } from "@prisma/client";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody } from "../../../../Card";

export const TasksList = ({
  tasks,
  course,
}: {
  tasks: Task[];
  course: Course;
}) => {
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
                <IconButton
                  aria-label="Ver tarea"
                  as="a"
                  icon={<ArrowForwardIcon />}
                  href={`/course/${course.slug}/tasks/${task.id}`}
                />
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
