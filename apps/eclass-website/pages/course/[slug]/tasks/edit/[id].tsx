import { FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { eventToFormValues } from "../../../../../utils/eventToFormValues";
import toLocaleISOString from "../../../../../utils/toLocaleISOString";

interface Props {
  initialTask: any
}

const TaskEditPage = ({ initialTask }: Props) => {
  const toast = useToast()
  const [task, setTask] = useState(initialTask)
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
    </>
  )
};

export const getServerSideProps = async (context: any) => {
  const taskId = context.params.id
  let task: any = await prisma.task.findUnique({
    where: {
      id: taskId
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
  task.dateStart = toLocaleISOString(task.dateStart).substring(0, 16) || null;
  task.dateEnd = toLocaleISOString(task.dateEnd).substring(0, 16) || null;

  return {
    props: {
      initialTask: task
    }
  };
};

export default TaskEditPage;
