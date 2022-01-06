import type { NextPage } from "next";
import { useContext, useEffect } from "react";
import { prisma } from "../../../lib/prisma";
import { CourseLayout, courseContext } from "../../../layouts/course-layout";
import { Flex, GridItem } from "@chakra-ui/react";
import { Loader } from "../../../components/Loader";

const Tasks: NextPage = ({ course }) => {
  const { setCourse } = useContext(courseContext);
  useEffect(() => {
    setCourse(course);
  }, []);

  return (
    <GridItem colSpan={12}>
      <Flex justify="center" width="100%" height="20rem">
        <Loader />
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

  return {
    props: { course },
  };
};

export default Tasks;
