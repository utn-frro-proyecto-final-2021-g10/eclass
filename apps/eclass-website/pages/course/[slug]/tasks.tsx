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
} from "@chakra-ui/react";
import { Card, CardBody } from "../../../components/Card";
import { AddIcon, ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { Course, Task, Form, Role } from "@prisma/client";
import { getFormValues } from "../../../utils/getFormValues";
import { FullTask } from "../../../types/Task";
import { useFormToast } from "../../../hooks/useFormToast";
import router from "next/router";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { GridContainer } from "../../../components/GridContainer";
import { CourseCard } from "../../../components/pages/home/CourseCard";

const Tasks: NextPage<{
  course: Course;
  tasks: any[];
}> = ({ course, tasks }) => {
  const me = useCurrentUser();
  const { setCourse } = useContext(courseContext);
  const [showForm, setShowForm] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questions, setQuestions] = useState([0]);
  const { showToast } = useFormToast({
    successMessage: "Task created!",
  });

  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);

    let properties = Object.getOwnPropertyNames(values);
    let answers = properties.filter((s) => s.startsWith("Answer-"));
    let questions = properties.filter((s) => s.startsWith("Question-"));
    let points = properties.filter((s) => s.startsWith("Points-"));
    let fields = [];
    for (let i = 0; i < questions.length; i++) {
      const questionKey = questions[i];
      const answerKey = answers[i];
      const pointsKey = points[i];
      fields.push({
        question: values[questionKey],
        correctAnswer: values[answerKey],
        value: parseFloat(values[pointsKey]),
        type: "Writing",
      });
    }

    let task = {
      courseId: course.id,
      name: values.taskName,
      description: values.taskDescription,
      dateEnd: values.endDate ? new Date(values.endDate).toISOString() : null,
      dateStart: values.startDate
        ? new Date(values.startDate).toISOString()
        : null,
      form: {
        create: {
          fields: {
            createMany: {
              data: fields,
            },
          },
        },
      },
    };

    const result = await fetch("/api/v1/task", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    if (data?.success == true) {
      showToast(data);
      router.reload();
    }
  };

  useEffect(() => {
    setCourse(course);
  }, []);

  return (
    <GridItem colSpan={12}>
      {me?.role == Role.professor && (
        <Grid justify="center" width="100%" height="auto">
          <Card>
            <CardBody>
              <HStack align="center" justify="space-between">
                <HStack>
                  <Avatar size="sm" />
                  <Text fontSize="sm">Create a task!</Text>
                </HStack>
                <Button onClick={() => setShowForm(!showForm)}>
                  {showForm ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </Button>
              </HStack>

              {showForm && (
                <form onSubmit={createTask}>
                  <Divider />
                  <Box width="80%" margin="auto" marginTop="1.5rem">
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input
                        width="100%"
                        placeholder="Task name"
                        name="taskName"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Input
                        width="100%"
                        placeholder="Task description"
                        name="taskDescription"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Start Date</FormLabel>
                      <Input
                        type="datetime-local"
                        width="100%"
                        defaultValue={Date.now()}
                        name="startDate"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>End Date</FormLabel>
                      <Input
                        type="datetime-local"
                        width="100%"
                        name="endDate"
                      />
                    </FormControl>
                  </Box>
                  <Grid
                    paddingTop="1.2em"
                    templateColumns="repeat(5, 1fr)"
                    width="80%"
                    gap={4}
                  >
                    <GridItem colSpan={4} colStart={2}>
                      <Box boxShadow="xs" p="6" rounded="md" bg="white">
                        <Text
                          fontWeight="bold"
                          fontSize="1.2rem"
                          marginBottom="0.7rem"
                        >
                          Add your questions here:{" "}
                        </Text>
                        {questions.length > 0 &&
                          questions[0] !== 0 &&
                          questions.map((question, i) => (
                            <>
                              <FormControl>
                                <FormLabel>Question {question}</FormLabel>
                                <Input
                                  name={`Question-${i}`}
                                  placeholder="Question"
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>
                                  Answer to question {question}
                                </FormLabel>
                                <Input
                                  name={`Answer-${i}`}
                                  placeholder="Answer to question(optional)"
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>
                                  Points for question {question}
                                </FormLabel>
                                <Input
                                  name={`Points-${i}`}
                                  placeholder="How many points"
                                />
                              </FormControl>
                            </>
                          ))}
                      </Box>
                    </GridItem>
                    <GridItem colSpan={1} colStart={2} justifySelf="start">
                      <Button
                        onClick={() => {
                          setQuestionNumber(questionNumber + 1);
                          if (questions.length === 1 && questions[0] === 0)
                            setQuestions([1]);
                          else setQuestions([...questions, questionNumber]);
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </GridItem>

                    <GridItem colSpan={5} justifySelf="end">
                      <Button type="submit" width="100%">
                        Submit
                      </Button>
                    </GridItem>
                  </Grid>
                </form>
              )}
            </CardBody>
          </Card>
        </Grid>
      )}
      <Flex>
        {tasks && tasks?.length === 0 ? (
          <Text> No hay tareas en el curso</Text>
        ) : (
          <GridContainer>
            {/* TODO: tasks list */}
            {tasks.map((task) => (
              <CourseCard course={task.name} />
            ))}
          </GridContainer>
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
  });
  // If course is null return empty
  if (!course) {
    return { props: {} };
  }

  const fetchCourseTasks = async (): Promise<any[]> => {
    const tasks = await prisma.task.findMany({
      where: {
        courseId: course.id.toString(),
      },
    });
    return tasks;
  };
  let tasks = await fetchCourseTasks();
  // Todo: parse datetime
  tasks = tasks.map((task) => ({
    id: task.id,
    courseId: task.courseId,
    description: task.description,
    name: task.name,
  }));
  return {
    props: { course, tasks },
  };
};

export default Tasks;
