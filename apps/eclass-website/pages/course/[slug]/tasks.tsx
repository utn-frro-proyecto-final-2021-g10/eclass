import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { prisma } from "../../../lib/prisma";
import { CourseLayout, courseContext } from "../../../layouts/course-layout";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Questions } from "../../../components/pages/course/tasks";
import { Card, CardBody } from "../../../components/Card";
import { AddIcon, ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

const Tasks: NextPage = ({ course }) => {
  const { setCourse } = useContext(courseContext);
  const [showForm, setShowForm] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questions, setQuestions] = useState([0]);
  useEffect(() => {
    setCourse(course);
  }, []);

  return (
    <GridItem colSpan={12}>
      <Grid justify="center" width="100%" height="auto">
        <Card>
          <CardBody width="100%">
            <HStack align="center" justify="space-between">
              <HStack>
                <Avatar size="sm" />
                <Text fontSize="sm">Crea una tarea!</Text>
              </HStack>
              <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </Button>
            </HStack>

            {showForm && (
              <>
                <Divider />
                <Grid
                  paddingTop="1.2em"
                  templateColumns="repeat(5, 1fr)"
                  width="80%"
                  align="center"
                  gap={4}
                >
                  <GridItem colSpan={1} alignSelf="end" justifySelf="end">
                    <FormLabel>Name</FormLabel>
                  </GridItem>
                  <GridItem colSpan={4}>
                    <Input width="100%" placeholder="Task name" />
                  </GridItem>
                  <GridItem colSpan={1} alignSelf="end" justifySelf="end">
                    <FormLabel>Description</FormLabel>
                  </GridItem>
                  <GridItem colSpan={4}>
                    <Input width="100%" placeholder="Task description" />
                  </GridItem>
                  {/* TODO: Poner un datetimepicker */}
                  <GridItem colSpan={1} alignSelf="end" justifySelf="end">
                    <FormLabel>Start Date</FormLabel>
                  </GridItem>
                  <GridItem colSpan={4}>
                    <Input width="100%" placeholder="dd/MM/yyyy hh:mm" />
                  </GridItem>
                  <GridItem colSpan={1} alignSelf="end" justifySelf="end">
                    <FormLabel>End Date</FormLabel>
                  </GridItem>
                  <GridItem colSpan={4}>
                    <Input width="100%" placeholder="dd/MM/yyyy hh:mm" />
                  </GridItem>
                  <GridItem colSpan={5} width="100%">
                  <Questions
                    questions={questions}
                  />
                  </GridItem>
                  <GridItem colSpan={1} colStart={2} justifySelf="start">
                    <Button
                      onClick={() => {
                        setQuestionNumber(questionNumber + 1);
                        if (questions.length === 1 && questions[0] === 0) setQuestions([1]);
                        else setQuestions(questions.concat([questionNumber]));
                      }
                      }
                    >
                      <AddIcon />
                    </Button>
                  </GridItem>

                  <GridItem colSpan={5} justifySelf="end">
                    <Button width="100%">Submit</Button>
                  </GridItem>
                </Grid>
              </>
            )}
          </CardBody>
        </Card>
      </Grid>
      <Flex>
        {course.tasks ? (
          <Text> No hay tareas en el curso</Text>
        ) : (
          <Text> Tareas </Text>
        )}
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
    include: {
      tasks: true,
    },
  });
  return {
    props: { course },
  };
};

export default Tasks;
