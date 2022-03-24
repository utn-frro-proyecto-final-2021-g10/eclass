import { Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { Course, Task } from "@prisma/client";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { CardBody } from "../../../Card";

export const TasksList = ({ course }) => {
  const me = useCurrentUser();
  return (
    <CardBody px={0} py={0}>
        <VStack align="left" spacing={0} divider={<Divider />}>
          {course?.Tasks.map((task, i: number) => (
            <HStack
              key={i}
              py={3}
              px={4}
              justify="space-between"
              as="button"
              _hover={{
                backgroundColor: "gray.50",
              }}
              sx={{
                transition: "background-color 0.2s ease-in-out",
              }}
              
            >
              <HStack spacing="4">
                <HStack spacing="2">
                  <Text fontSize="md">
                    {task.name}
                  </Text>
                </HStack>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </CardBody>
  )
};
