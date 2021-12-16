import type { NextPage } from "next";
import { CourseLayout } from "../../../layouts/course-layout";
import { GridItem } from "@chakra-ui/react";
import { MemberList } from "../../../components/pages/course/members/MemberList";

const Members: NextPage = () => {
  return (
    <>
      {[...Array(2)].map((i) => (
        <GridItem key={i} colSpan={12}>
          <MemberList />
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
Members.getLayout = function getLayout(page: NextPage) {
  return <CourseLayout course={course}>{page}</CourseLayout>;
};

export default Members;
