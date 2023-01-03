import type { NextPage } from "next";
import { CourseLayout } from "../../../layouts/course-layout";
import { useCurrentCourse } from "../../../hooks/useCurrentCourse";
import { GridItem, Text } from "@chakra-ui/react";
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
      {courseData.data.files.length === 0 ? (
        <Text color={"gray.500"}>
          No se encontraron archivos asignados al curso
        </Text>
      ) : (
        <MaterialList files={courseData.data.files} />
      )}
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
