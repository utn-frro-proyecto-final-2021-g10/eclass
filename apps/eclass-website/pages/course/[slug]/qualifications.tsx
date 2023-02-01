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
  GridItem
} from '@chakra-ui/react';

interface Dictionary {
  [key: string]: any[];
}

const QualificationsPage: NextPage<{
  courseId: string,
  tasks: any,
  userAnswersDictionary: Dictionary
}> = ({ courseId, tasks, userAnswersDictionary }) => {
  const courseData = useCurrentCourse(courseId);

  return (
    <>
      <GridItem colSpan={12}>
        <TableContainer>
          {tasks &&

            <Table variant={"simple"}>
              <Thead>
                <Tr>
                  <Td>
                    <Text fontWeight="bold">User</Text>
                  </Td>
                  {tasks.map((task: any) => (
                    <Td key={task.name}>{task.name}</Td>
                  ))}
                </Tr>
              </Thead>
              <Tbody>

                {Object.keys(userAnswersDictionary).map((key: string) => (
                  <Tr key={key}>
                    <Td>{key}</Td>
                    {Array.isArray(userAnswersDictionary[key]) &&
                      userAnswersDictionary[key].map((elem: any) => (
                        <Td key={`${elem.taskId}-${elem.userId}`}>{elem.qualification || "No resuelto"}</Td>
                      ))
                    }

                  </Tr>
                ))}

              </Tbody>

            </Table>
          }
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
        slug: context.params.slug
      }
    },
    select: {
      id: true,
      name: true
    }
  })
  const users = await prisma.user.findMany({
    where: {
      courses: {
        some: {
          course: {
            slug: context.params.slug
          }
        }
      },
      role: "student"

    },
    select: {
      firstName: true,
      lastName: true,
      answers: {
        select: {
          taskId: true,
          userId: true,
          qualification: true
        }
      }
    }
  })


  let usersDict: Dictionary = {}
  let longestArray = 0
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    usersDict[`${user.firstName}, ${user.lastName}`] = []
  }

  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    for (let usersIndex = 0; usersIndex < users.length; usersIndex++) {
      const user = users[usersIndex];
      let taskAnswers = user.answers.filter((answer: any) => answer.taskId == task.id)
      let dictValue = usersDict[`${user.firstName}, ${user.lastName}`]
      dictValue.push(taskAnswers.length > 0 ? taskAnswers[0] : "")
      usersDict[`${user.firstName}, ${user.lastName}`] = dictValue
    }
  }
  console.log(JSON.stringify(usersDict, null, 2));


  return {
    props: { courseId: context.params.slug, tasks: tasks, userAnswersDictionary: usersDict },
  };
};

export default QualificationsPage;
