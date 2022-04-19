import type { NextPage } from "next";
import { useContext, useEffect } from "react";
import { prisma } from "../../../lib/prisma";
import { CourseLayout, courseContext } from "../../../layouts/course-layout";
import { Box, Flex, GridItem, Link, Text, VStack } from "@chakra-ui/react";
import { Course, Task, Role } from "@prisma/client";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { TaskForm } from "../../../components/Task/TaskForm";
import { Card } from "../../../components/Card";

const Tasks: NextPage<{
  course: Course;
  tasks: any[];
}> = ({ course, tasks }) => {
  const me = useCurrentUser();
  const { setCourse } = useContext(courseContext);

  useEffect(() => {
    setCourse(course);
  }, []);

  return (
    <GridItem colSpan={12}>
      {me?.role == Role.professor && <TaskForm course={course} />}
      <Flex>
        {tasks && tasks?.length === 0 ? (
          <Box
            width={"100%"}
            boxShadow="base"
            p="6"
            rounded="md"
            bg="white"
            marginTop={"2rem"}
          >
            <Text>No hay tareas en el curso</Text>
          </Box>
        ) : (
          <VStack marginTop={"2rem"} spacing={4} align="stretch" width={"100%"}>
            {/* TODO: tasks list */}

            {tasks.map((task: Task, index) => (
              <>
                <Card href={`/course/${course.slug}/${task.id}`}>
                  <Box
                    width={"100%"}
                    boxShadow="base"
                    p="6"
                    rounded="md"
                    bg="white"
                  >
                    <Text fontSize={"2xl"} as={"i"}>
                      {task.name}
                    </Text>
                    <Text>{task.description}</Text>
                  </Box>
                </Card>
              </>
            ))}
          </VStack>
        )}
      </Flex>
    </GridItem>
  );
};

// @ts-ignore
Tasks.getLayout = function getLayout(page: ReactElement) {
  return <CourseLayout>{page}</CourseLayout>;
};

export const getServerSideProps = async (context: any) => {
  // TODD: check if the user belongs to the course

  const course = await prisma.course.findUnique({
    where: {
      slug: context.params.slug,
    },
  });
  // If course is null return empty
  if (!course) {
    return { props: {} };
  }

  const fetchCourseTasks = async (): Promise<any[]> => {
    const tasks = await prisma.task.findMany({
      where: {
        courseId: course.id.toString(),
      },
    });
    return tasks;
  };
  let tasks = await fetchCourseTasks();
  // Todo: parse datetime
  tasks = tasks.map((task) => ({
    id: task.id,
    courseId: task.courseId,
    description: task.description,
    name: task.name,
  }));
  return {
    props: { course, tasks },
  };
};

export default Tasks;
