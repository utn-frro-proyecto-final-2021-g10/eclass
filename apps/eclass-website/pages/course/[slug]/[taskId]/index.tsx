import { Box, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { Answer } from "@prisma/client";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Card } from "../../../../components/Card";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { FullTask } from "../../../../types/Task";
import { FullUser } from "../../../../types/User";
import answer from "../../../api/v1/answer";

const Task: NextPage<{ task: FullTask }> = (fullTask) => {
  const me = useCurrentUser();

  const [answer, setAnswer] = useState({});
  useEffect(() => {
    const getAnswer = async (me: FullUser) => {
      const response = await fetch(
        `/api/v1/answer/${me?.id}/${fullTask.task.id}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (data.success) return data.answer;
    };
    if (me) {
      const answer = getAnswer(me);
      setAnswer(answer);
    }
  }, []);
  if (Object.keys(answer).length !== 0) {
    return (
      <>
        <Card>
          <Text>{JSON.stringify(answer)}</Text>
        </Card>
      </>
    );
  }
  return (
    <>
      <Card>
        <Text>{JSON.stringify(fullTask)}</Text>
      </Card>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  // TODD: check if the user belongs to the course
  const { taskId } = context.params;
  const task = await prisma.task.findUnique({
    where: {
      id: taskId.toString(),
    },
    include: {
      form: {
        select: {
          fields: true,
        },
      },
    },
  });

  return {
    props: { task },
  };
};

export default Task;
