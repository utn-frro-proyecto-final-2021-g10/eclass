import { AddIcon, ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import { Course } from "@prisma/client";
import router from "next/router";
import { useEffect, useState } from "react";
import { useFormToast } from "../../hooks/useFormToast";
import { getFormValues } from "../../utils/getFormValues";
import { Card, CardBody } from "../Card";

export const TaskForm = ({ course }: { course: Course }) => {
  const { showToast } = useFormToast({
    successMessage: "Task created!",
  });
  const [showForm, setShowForm] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questions, setQuestions] = useState([0]);

  const createTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);

    let properties = Object.getOwnPropertyNames(values);
    let answers = properties.filter((s) => s.startsWith("Answer-"));
    let questions = properties.filter((s) => s.startsWith("Question-"));
    let points = properties.filter((s) => s.startsWith("Points-"));
    let types = properties.filter((s) => s.startsWith("Types-"));
    let fields = [];
    for (let i = 0; i < questions.length; i++) {
      const questionKey = questions[i];
      const answerKey = answers[i];
      const pointsKey = points[i];
      const typesKey = types[i];
      fields.push({
        question: values[questionKey],
        correctAnswer: values[answerKey],
        value: parseFloat(values[pointsKey]),
        type: values[typesKey],
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

  return (
    <>
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
                      isRequired={true}
                      width="100%"
                      placeholder="Task name"
                      name="taskName"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input
                      isRequired={true}
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
                      name="startDate"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>End Date</FormLabel>
                    <Input type="datetime-local" width="100%" name="endDate" />
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
                        Add your questions here:
                      </Text>
                      {questions.length > 0 &&
                        questions[0] !== 0 &&
                        questions.map((question, i) => (
                          <>
                            <br />
                            <FormControl>
                              <RadioGroup
                                defaultValue="writing"
                                name={`Types-${i}`}
                              >
                                <HStack spacing="24px">
                                  <Radio value="writing">Writing</Radio>
                                  <Radio
                                    isDisabled={true}
                                    value="multipleChoice"
                                  >
                                    Multiple Choice(coming soon)
                                  </Radio>
                                </HStack>
                              </RadioGroup>
                            </FormControl>
                            <FormControl>
                              <FormLabel>Question {question}</FormLabel>
                              <Input
                                isRequired={true}
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
                              <NumberInput
                                name={`Points-${i}`}
                                placeholder="How many points"
                                defaultValue={0}
                                precision={0.2}
                              >
                                <NumberInputField />
                              </NumberInput>
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
    </>
  );
};
