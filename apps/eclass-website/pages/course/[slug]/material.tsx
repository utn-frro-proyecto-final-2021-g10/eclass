import type { NextPage } from "next";
import { CourseLayout } from "../../../layouts/course-layout";
import { GridItem } from "@chakra-ui/react";
import { MaterialList } from "../../../components/pages/course/material/MaterialList";

const Material: NextPage = () => {
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

const course = {
  id: "1",
  name: "Estructuras de datos",
  description: "Curso de estructuras de datos",
  slug: "estructuras-de-datos",
};

// @ts-ignore
Material.getLayout = function getLayout(page: NextPage) {
  return <CourseLayout course={course}>{page}</CourseLayout>;
};

export default Material;
