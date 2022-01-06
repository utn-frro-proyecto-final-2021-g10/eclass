import type { NextPage } from "next";
import { useContext, useEffect } from "react";
import { prisma } from "../../../lib/prisma";
import { CourseLayout, courseContext } from "../../../layouts/course-layout";
import { Avatar, GridItem, HStack, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Card, CardBody } from "../../../components/Card";
import { Publication } from "../../../components/pages/course/feed/Publication";

const Feed: NextPage = ({ course }) => {
  const { setCourse } = useContext(courseContext);
  useEffect(() => {
    setCourse(course);
  }, []);

  return (
    <>
      <GridItem colSpan={12}>
        <Card>
          <CardBody>
            <HStack align="center" justify="space-between">
              <HStack>
                <Avatar size="sm" />
                <Text fontSize="sm">Haz una publicación!</Text>
              </HStack>
              <ArrowForwardIcon />
            </HStack>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem colSpan={12}>
        <Publication />
      </GridItem>
      <GridItem colSpan={12}>
        <Publication />
      </GridItem>
    </>
  );
};

// @ts-ignore
Feed.getLayout = function getLayout(page: NextPage) {
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

export default Feed;
