import type { NextPage } from "next";
import { CourseLayout } from "../../../layouts/course-layout";
import { useCurrentCourse } from "../../../hooks/useCurrentCourse";
import { GridItem } from "@chakra-ui/react";
import { Publication } from "../../../components/pages/course/feed/Publication";
import { Message } from "@prisma/client";
import { Loader } from "../../../components/Loader";
import { NewPublication } from "../../../components/pages/course/feed/NewPublication";

const Feed: NextPage<{ courseId: string }> = ({ courseId }) => {
  const courseData = useCurrentCourse(courseId);

  return (
    <>
      <GridItem colSpan={12}>
        <NewPublication forumId={courseData.data?.forumId} />
      </GridItem>
      {courseData?.data?.forum.messages.map(
        (message: Message, index: number) => (
          <GridItem colSpan={12} key={index}>
            <Publication message={message} />
          </GridItem>
        )
      )}
    </>
  );
};

// @ts-ignore
Feed.getLayout = function getLayout(page: NextPage) {
  return <CourseLayout>{page}</CourseLayout>;
};

export const getServerSideProps = async (context: any) => {
  // TODD: check if the user belongs to the course
  return {
    props: { courseId: context.params.slug },
  };
};

export default Feed;
