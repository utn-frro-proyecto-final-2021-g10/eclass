import { FormControl, FormLabel, Input, Button, useToast, Radio, RadioGroup, NumberInput, NumberInputField } from "@chakra-ui/react";
import { useState } from "react";
import { eventToFormValues } from "../../../../../utils/eventToFormValues";
import toLocaleISOString from "../../../../../utils/toLocaleISOString";

interface Props {
  initialTask: any
}

const TaskEditPage = ({ initialTask }: Props) => {
  const toast = useToast()
  const [task, setTask] = useState(initialTask)
  const [questionType, setQuestionType] = useState("text")
  const handleCreateField = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e)

    let possibleAnswers;
    if (questionType === "text") possibleAnswers = null
    else if (questionType === "multiple-choice") possibleAnswers = values.possibleAnswers
    else if (questionType === "truth-or-false") possibleAnswers = "v,f"

    const field = {
      type: questionType,
      question: values.question,
      possibleAnswers: possibleAnswers,
      correctAnswer: questionType !== "text" ? values.correctAnswer : null,
      value: parseInt(values.value, 10),
    }
    task.fields.push(field)
    const insert = {
      dateStart: new Date(task.dateStart),
      dateEnd: new Date(task.dateEnd),
      name: task.name,
      description: task.description,
      courseId: task.courseId,
      fields: {
        createMany: {
          skipDuplicates: true,
          data: task.fields,
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
        description: 'Task updated sucesfully',
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
  const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e)
    const updatedTask = {
      name: values.name,
      description: values.description,
      dateStart: new Date(values.dateStart) || null,
      dateEnd: new Date(values.dateEnd),
    }
    const result = await fetch(`/api/v1/task/${initialTask.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status === 200) {
      toast({
        title: 'Updated',
        description: 'Task updated sucesfully',
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

  };

  return (
    <>
      <form onSubmit={handleTaskSubmit}>
        <FormControl>
          <FormLabel>Name: </FormLabel>
          <Input name="name" defaultValue={initialTask.name}></Input>
          <FormLabel>Description: </FormLabel>
          <Input name="description" defaultValue={initialTask.description}></Input>
          <FormLabel>Date Start: </FormLabel>
          <Input
            name="dateStart"
            type={"datetime-local"}
            defaultValue={initialTask.dateStart || ""}
          ></Input>
          <FormLabel>Date End: </FormLabel>
          <Input
            name="dateEnd"
            type={"datetime-local"}
            defaultValue={initialTask?.dateEnd || ""}
          ></Input>
          <Button type="submit">Update</Button>
        </FormControl>
      </form>
      <pre>{JSON.stringify(task.fields, null, 2)}</pre>
      <form onSubmit={handleCreateField}>
        <FormControl>
          <RadioGroup
            name="type"
            defaultValue={"text"}
            onChange={(e) => setQuestionType(e)}
          >
            <Radio value={"text"}>Text</Radio>
            <Radio value={"multiple-choice"}>Multiple Choice</Radio>
            <Radio value={"truth-or-false"}>Truth or False</Radio>
          </RadioGroup>
          <FormLabel>Question</FormLabel>
          <Input name="question" placeholder="Write your question here. Include options and descriptions if necessary"></Input>
          {questionType !== "text" &&
            <>
              {questionType === "multiple-choice" &&
                <>
                  <FormLabel>Posible Answers</FormLabel>
                  <Input name="possibleAnswers" placeholder="Comma separated list of posible answers (a,b,c,d,...)"></Input>
                </>
              }
              <FormLabel>Answer</FormLabel>
              <Input name="correctAnswer"></Input>
            </>
          }
          <FormLabel>Value</FormLabel>
          <NumberInput name="value" min={0}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <Button type="submit">Create</Button>
      </form>
    </>
  )
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

export default TaskEditPage;
