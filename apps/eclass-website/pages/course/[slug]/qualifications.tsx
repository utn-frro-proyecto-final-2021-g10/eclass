import type { NextPage } from "next";
import { CourseLayout } from "../../../layouts/course-layout";
import { useCurrentCourse } from "../../../hooks/useCurrentCourse";
import {
  Table,
  Tbody,
  Thead,
  Tr,
  Td,
  Text,
  TableContainer,
  GridItem,
  Badge,
} from "@chakra-ui/react";

interface Dictionary {
  [key: string]: any[];
}

const QualificationsPage: NextPage<{
  courseId: string;
  tasks: any;
  userAnswersDictionary: Dictionary;
}> = ({ courseId, tasks, userAnswersDictionary }) => {
  useCurrentCourse(courseId);

  console.log(userAnswersDictionary);

  return (
    <>
      <GridItem colSpan={12}>
        <TableContainer
          border={"1px solid"}
          borderColor={"gray.100"}
          borderRadius={"15px"}
        >
          {tasks && (
            <Table variant={"simple"} borderRadius={15}>
              <Thead bg={"teal.400"}>
                <Tr>
                  <Td>
                    <Text fontWeight="bold" color={"white"} fontSize={"large"}>
                      User
                    </Text>
                  </Td>
                  {tasks.map((task: any) => (
                    <Td key={task.name} fontWeight="bold" color={"white"}>
                      {task.name}
                    </Td>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(userAnswersDictionary).map((key: string) => (
                  <Tr key={key}>
                    <Td fontSize={"large"} fontWeight={"semibold"}>
                      {key}
                    </Td>
             
                    {Array.isArray(userAnswersDictionary[key]) &&
                      userAnswersDictionary[key].map((elem: any) => (
                        <Td key={`${elem.taskId}-${elem.userId}`}>
                          {(
                            <>
                              <Badge colorScheme="blue" fontSize="xl">
                                {elem?.reduce(
                                  (acc: number, field: any) => {
                                    return acc + field.fields?.qualification;
                                  },
                                  0
                                )}
                              </Badge>{" "}
                              /{" "}
                              <Badge colorScheme="green" fontSize="xl">
                                {elem?.reduce(
                                  (acc: number, field: any) => {
                                    return acc + field.fields.value;
                                  },
                                  0
                                )}
                              </Badge>
                            </>
                          ) || "No resuelto"}
                        </Td>
                      ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </TableContainer>
      </GridItem>
    </>
  );
};

// @ts-ignore
QualificationsPage.getLayout = function getLayout(page: NextPage) {
  return <CourseLayout>{page}</CourseLayout>;
};

export const getServerSideProps = async (context: any) => {
  // TODD: check if the user belongs to the course

  const tasks = await prisma.task.findMany({
    where: {
      course: {
        slug: context.params.slug,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
  const users = await prisma.user.findMany({
    where: {
      courses: {
        some: {
          course: {
            slug: context.params.slug,
          },
        },
      },
      role: "student",
    },
    select: {
      firstName: true,
      lastName: true,
      answers: {
        select: {
          fields: {
            select: {
              value: true,
              qualification: true,
            },
          },
          taskId: true,
          userId: true,
        },
      },
    },
  });

  let usersDict: Dictionary = {};
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    usersDict[`${user.firstName}, ${user.lastName}`] = [];
  }

  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    for (let usersIndex = 0; usersIndex < users.length; usersIndex++) {
      const user = users[usersIndex];
      let taskAnswers = user.answers.filter(
        (answer: any) => answer.taskId == task.id
      );
      let dictValue = usersDict[`${user.firstName}, ${user.lastName}`];
      dictValue.push(taskAnswers.length > 0 ? taskAnswers[0] : "");
      usersDict[`${user.firstName}, ${user.lastName}`] = dictValue;
    }
  }

  return {
    props: {
      courseId: context.params.slug,
      tasks: tasks,
      userAnswersDictionary: usersDict,
    },
  };
};

export default QualificationsPage;
