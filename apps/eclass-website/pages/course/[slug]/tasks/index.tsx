import { NextPage } from "next";
import { CourseLayout } from "../../../../layouts/course-layout";
import { Divider, GridItem, Text } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { TaskForm } from "../../../../components/pages/course/tasks/TaskForm";
import { TasksList } from "../../../../components/pages/course/tasks/TasksList";
import { useCurrentCourse } from "../../../../hooks/useCurrentCourse";

const Tasks: NextPage<{ courseId: string }> = ({ courseId }) => {
  const me = useCurrentUser();
  const courseData = useCurrentCourse(courseId);

  return (
    <>
      {courseData.data && (
        <>
          {me?.role == Role.professor && (
            <>
              <GridItem colSpan={12}>
                <TaskForm course={courseData.data} />
              </GridItem>
              <GridItem colSpan={12}>
                <Divider />
              </GridItem>
            </>
          )}

          {
            <GridItem colSpan={12}>
              {courseData.data.tasks.length === 0 ? (
                <Text color={"gray.500"}>
                  No se encontraron tarea asignadas al curso
                </Text>
              ) : (
                <TasksList
                  tasks={courseData.data.tasks}
                  course={courseData.data}
                />
              )}
            </GridItem>
          }
        </>
      )}
    </>
  );
};

// @ts-ignore
Tasks.getLayout = function getLayout(page: ReactElement) {
  return <CourseLayout>{page}</CourseLayout>;
};

export const getServerSideProps = async (context: any) => {
  // TODD: check if the user belongs to the course
  return {
    props: { courseId: context.params.slug },
  };
};

export default Tasks;
