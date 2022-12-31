import type { NextPage } from "next";
import { CourseLayout } from "../../../layouts/course-layout";
import { useCurrentCourse } from "../../../hooks/useCurrentCourse";
import { GridItem } from "@chakra-ui/react";
import { MaterialList } from "../../../components/pages/course/material/MaterialList";
import { Loader } from "../../../components/Loader";

const Material: NextPage<{ courseId: string }> = ({ courseId }) => {
  const courseData = useCurrentCourse(courseId);

  if (courseData.status === "loading") {
    return (
      <GridItem colSpan={12}>
        <Loader />
      </GridItem>
    );
  }

  return (
    <GridItem colSpan={12}>
      <MaterialList />
    </GridItem>
  );
};

// @ts-ignore
Material.getLayout = function getLayout(page: NextPage) {
  return <CourseLayout>{page}</CourseLayout>;
};

export const getServerSideProps = async (context: any) => {
  // TODD: check if the user belongs to the course
  return {
    props: { courseId: context.params.slug },
  };
};

export default Material;
