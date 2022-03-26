import type { NextPage } from "next";
import { useContext, useEffect } from "react";
import { prisma } from "../../../lib/prisma";
import { CourseLayout, courseContext } from "../../../layouts/course-layout";
import { Avatar, Button, Flex, GridItem, HStack, Text } from "@chakra-ui/react";
import { Loader } from "../../../components/Loader";
import { TasksList } from "../../../components/pages/course/tasks";
import { Card, CardBody } from "../../../components/Card";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const Tasks: NextPage = ({ course }) => {
  const { setCourse } = useContext(courseContext);
  useEffect(() => {
    setCourse(course);
  }, []);

  return (
    <GridItem colSpan={12}>
      <Flex justify="center" width="100%" height="20rem">
        <Card>
          <CardBody>
          <HStack align="center" justify="space-between">
              <HStack>
                <Avatar size="sm" />
                <Text fontSize="sm">Crea una tarea!</Text>
              </HStack>
              <Button>
                <ArrowForwardIcon />
              </Button>
            </HStack>
          </CardBody>
        </Card>
        {course.tasks ?
         <Loader /> : 
         <TasksList 
          course={course}
         />}
        
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
    include:{
      tasks: true
    }
  });
  return {
    props: { course },
  };
};

export default Tasks;
