import { Button, FormControl, FormLabel, Input, Radio, RadioGroup, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import StudentAnswerForm from "../../../../components/Forms/StudentAnswerForm";
import StudentTaskFormWrapper from "../../../../components/Forms/StudentTaskFormWrapper";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { eventToFormValues } from "../../../../utils/eventToFormValues";
import toLocaleISOString from "../../../../utils/toLocaleISOString";

interface Props {
  initialTask: any
}
const Task = ({ initialTask }: Props) => {
  const me = useCurrentUser()
  const toast = useToast()
  const [task, setTask] = useState(initialTask)
  const [myAnswer, setMyAnswer] = useState<any>(null)

  const handleAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const values = eventToFormValues(e)

    const fields = new Array()
    for (const [key, value] of Object.entries(values)) {
      let field = myAnswer ?
        myAnswer.fields.filter((field: any) => field.id === key)[0] :
        task.fields.filter((field: any) => field.id === key)[0]

      field.studentAnswer = value
      field.dateSubmitted = new Date()
      delete field.id
      fields.push(field)
    }
    const insert = {
      answers: {
        upsert: {
          where: {
            userId_taskId: {
              taskId: task.id,
              userId: me?.id
            }
          },
          create: {
            fields: {
              createMany: {
                data: fields
              }
            },
            dateSubmitted: new Date(),
            user: {
              connect: {
                id: me?.id
              }
            }
          },
          update: {
            fields: {
              deleteMany: {},
              createMany: {
                data: fields
              }
            },
            dateSubmitted: new Date(),
            user: {
              connect: {
                id: me?.id
              }
            }
          },
        }
      }
    }
    const result = await fetch(`/api/v1/task/${initialTask.id}`, {
      method: "PUT",
      body: JSON.stringify(insert),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      toast({
        title: 'Updated',
        description: 'Task answered sucesfully',
        status: "success"
      })
      const taskResult = await fetch(`/api/v1/task/${initialTask.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (taskResult.status === 200) {
        const data = await taskResult.json()
        setTask(data.task)
      }
    }
    else {
      toast({
        title: 'Error',
        description: JSON.stringify(await result.json(), null, 2),
        status: "error"
      })
    }
  }

  useEffect(() => {
    if (!task || !task.answers) return
    const myAnswer = task.answers.filter((answer: any) => answer.userId == me?.id)[0]

    setMyAnswer(myAnswer)
  }, [me?.id, task])


  if (me?.role === "student") {
    return (
      <StudentTaskFormWrapper handleSubmit={handleAnswer} task={task} myAnswer={myAnswer} />
    )
  }
  return <p>error</p>
};

Task.getLayout = function getLayout(page: NextPage) {
  return <CourseLayout>{page}</CourseLayout>;
};

export const getServerSideProps = async (context: any) => {
  const taskId = context.params.id
  let task: any = await prisma.task.findUnique({
    where: {
      id: taskId
    },
    include: {
      fields: {
        select: {
          type: true,
          question: true,
          possibleAnswers: true,
          correctAnswer: true,
          value: true,
          id: true,
        }
      },
      answers: {
        select: {
          fields: {
            select: {
              type: true,
              question: true,
              possibleAnswers: true,
              studentAnswer: true,
              correctAnswer: true,
              value: true,
              id: true,
            }
          },
          taskId: true,
          userId: true,
        }
      }
    }
  });
  if (!task) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }
  task.dateStart = task.dateStart !== null ? toLocaleISOString(task.dateStart).substring(0, 16) : null;
  task.dateEnd = toLocaleISOString(task.dateEnd).substring(0, 16) || null;

  return {
    props: {
      initialTask: task
    }
  };
};

export default Task;
