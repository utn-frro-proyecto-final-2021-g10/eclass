import type { NextPage } from "next";
import { CourseLayout } from "../../../layouts/course-layout";
import { Avatar, GridItem, HStack, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Card, CardBody } from "../../../components/Card";
import { Publication } from "../../../components/pages/course/feed/Publication";

const Feed: NextPage = () => {
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

const course = {
  id: "1",
  name: "Estructuras de datos",
  description: "Curso de estructuras de datos",
  slug: "estructuras-de-datos",
};

// @ts-ignore
Feed.getLayout = function getLayout(page: NextPage) {
  return <CourseLayout course={course}>{page}</CourseLayout>;
};

export default Feed;
