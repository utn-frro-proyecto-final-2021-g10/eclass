import type { NextPage } from "next";
import { useContext, useEffect } from "react";
import { prisma } from "../../../lib/prisma";
import { CourseLayout, courseContext } from "../../../layouts/course-layout";
import { Flex, GridItem } from "@chakra-ui/react";
import { Loader } from "../../../components/Loader";
import { TasksList } from "../../../components/pages/course/tasks";
import { Course } from "@prisma/client";

const Tasks: NextPage = ({ course }) => {
  const { setCourse } = useContext(courseContext);
  useEffect(() => {
    setCourse(course);
  }, []);

  return (
    <GridItem colSpan={12}>
      <Flex justify="center" width="100%" height="20rem">
        <Loader />
        <TasksList 
         course={course}
        />
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
    include:{
      Tasks: {
        select: {
          id: true,
          name: true,
          description: true,
          form: true,
          dateEnd: true,
          dateStart: true,
          answers: true,
        }
      }
    }
  });
  console.log(JSON.stringify(course, null, 4));
  return {
    props: { course },
  };
};

export default Tasks;
