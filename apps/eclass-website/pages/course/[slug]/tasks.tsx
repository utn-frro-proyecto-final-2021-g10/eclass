import type { NextPage } from "next";
import { CourseLayout } from "../../../layouts/course-layout";
import { Flex, GridItem } from "@chakra-ui/react";
import { Loader } from "../../../components/Loader";

const Tasks: NextPage = () => {
  return (
    <GridItem colSpan={12}>
      <Flex justify="center" width="100%" height="20rem">
        <Loader />
      </Flex>
    </GridItem>
  );
};

const course = {
  id: "1",
  name: "Estructuras de datos",
  description: "Curso de estructuras de datos",
  slug: "estructuras-de-datos",
};

// @ts-ignore
Tasks.getLayout = function getLayout(page: ReactElement) {
  return <CourseLayout course={course}>{page}</CourseLayout>;
};

export default Tasks;
