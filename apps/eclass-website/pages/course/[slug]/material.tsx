import type { NextPage } from "next";
import { useContext, useEffect } from "react";
import { prisma } from "../../../lib/prisma";
import { CourseLayout, courseContext } from "../../../layouts/course-layout";
import { GridItem } from "@chakra-ui/react";
import { MaterialList } from "../../../components/pages/course/material/MaterialList";

const Material: NextPage = ({ course }) => {
  const { setCourse } = useContext(courseContext);
  useEffect(() => {
    setCourse(course);
  }, []);

  return (
    <>
      {[...Array(3)].map((i) => (
        <GridItem key={i} colSpan={12}>
          <MaterialList />
        </GridItem>
      ))}
    </>
  );
};

// @ts-ignore
Material.getLayout = function getLayout(page: NextPage) {
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

export default Material;
