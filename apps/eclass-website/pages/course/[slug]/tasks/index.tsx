import type { NextPage } from "next";
import { prisma } from "../../../../lib/prisma";
import { CourseLayout } from "../../../../layouts/course-layout";
import { GridItem } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { TaskForm } from "../../../../components/pages/course/tasks/TaskForm";
import { TasksList } from "../../../../components/pages/course/tasks/TasksList";
import { useCurrentCourse } from "../../../../hooks/useCurrentCourse";
import { Loader } from "../../../../components/Loader";

const Tasks: NextPage<{
  courseId: string;
  tasks: any[];
}> = ({ courseId, tasks }) => {
  const me = useCurrentUser();
  const courseData = useCurrentCourse(courseId);

  if (courseData.status === "loading") {
    return (
      <GridItem colSpan={12}>
        <Loader />
      </GridItem>
    );
  }

  return (
    <>
      {me?.role == Role.professor && (
        <GridItem colSpan={12}>
          <TaskForm course={courseData.data} />
        </GridItem>
      )}

      <GridItem colSpan={12}>
        <TasksList tasks={tasks} course={courseData.data} />
      </GridItem>
    </>
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
    props: { courseId: context.params.slug, tasks },
  };
};

export default Tasks;
