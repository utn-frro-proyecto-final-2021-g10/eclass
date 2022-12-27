import {
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import TaskFieldForm from "../../../../../components/Forms/TaskFieldForm";
import { eventToFormValues } from "../../../../../utils/eventToFormValues";
import toLocaleISOString from "../../../../../utils/toLocaleISOString";

interface Props {
  initialTask: any;
}

const TaskEditPage = ({ initialTask }: Props) => {
  const toast = useToast();
  const [task, setTask] = useState(initialTask);

  const handleDelete = async (e: any, id: string) => {
    e.preventDefault();

    task.fields = task.fields.filter((field: any) => field.id !== id);

    const insert = {
      dateStart: new Date(task.dateStart),
      dateEnd: new Date(task.dateEnd),
      name: task.name,
      description: task.description,
      courseId: task.courseId,
      fields: {
        deleteMany: {},
        createMany: {
          skipDuplicates: true,
          data: task.fields,
        },
      },
    };
    const result = await fetch(`/api/v1/task/${initialTask.id}`, {
      method: "PUT",
      body: JSON.stringify(insert),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      toast({
        title: "Deleted",
        description: "Field deleted sucesfully",
        status: "success",
      });
      const taskResult = await fetch(`/api/v1/task/${initialTask.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (taskResult.status === 200) {
        const data = await taskResult.json();
        setTask(data.task);
      }
    } else {
      toast({
        title: "Error",
        description: JSON.stringify(await result.json(), null, 2),
        status: "error",
      });
    }
  };
  const handleCreateField = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    let possibleAnswers;
    if (values.type === "text") possibleAnswers = null;
    else if (values.type === "multiple-choice")
      possibleAnswers = values.possibleAnswers;
    else if (values.type === "truth-or-false") possibleAnswers = "v,f";

    const field = {
      type: values.type,
      question: values.question,
      possibleAnswers: possibleAnswers,
      correctAnswer: values.type !== "text" ? values.correctAnswer : null,
      value: parseInt(values.value, 10),
    };
    task.fields.push(field);
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
        },
      },
    };
    const result = await fetch(`/api/v1/task/${initialTask.id}`, {
      method: "PUT",
      body: JSON.stringify(insert),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      toast({
        title: "Updated",
        description: "Task updated sucesfully",
        status: "success",
      });
      const taskResult = await fetch(`/api/v1/task/${initialTask.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (taskResult.status === 200) {
        const data = await taskResult.json();
        setTask(data.task);
      }
    } else {
      toast({
        title: "Error",
        description: JSON.stringify(await result.json(), null, 2),
        status: "error",
      });
    }
  };
  const handleUpdateField = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    let possibleAnswers;
    if (values.type === "text") possibleAnswers = null;
    else if (values.type === "multiple-choice")
      possibleAnswers = values.possibleAnswers;
    else if (values.type === "truth-or-false") possibleAnswers = "v,f";

    task.fields = task.fields.filter((field: any) => field.id !== values.id);
    const field = {
      type: values.type,
      question: values.question,
      possibleAnswers: possibleAnswers,
      correctAnswer: values.type !== "text" ? values.correctAnswer : null,
      value: parseInt(values.value, 10),
    };
    task.fields.push(field);
    const insert = {
      dateStart: new Date(task.dateStart),
      dateEnd: new Date(task.dateEnd),
      name: task.name,
      description: task.description,
      courseId: task.courseId,
      fields: {
        deleteMany: {},
        createMany: {
          skipDuplicates: true,
          data: task.fields,
        },
      },
    };
    const result = await fetch(`/api/v1/task/${initialTask.id}`, {
      method: "PUT",
      body: JSON.stringify(insert),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      toast({
        title: "Updated",
        description: "Task updated sucesfully",
        status: "success",
      });
      const taskResult = await fetch(`/api/v1/task/${initialTask.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (taskResult.status === 200) {
        const data = await taskResult.json();
        setTask(data.task);
      }
    } else {
      toast({
        title: "Error",
        description: JSON.stringify(await result.json(), null, 2),
        status: "error",
      });
    }
  };
  const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);
    const updatedTask = {
      name: values.name,
      description: values.description,
      dateStart: new Date(values.dateStart) || null,
      dateEnd: new Date(values.dateEnd),
    };
    const result = await fetch(`/api/v1/task/${initialTask.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status === 200) {
      toast({
        title: "Updated",
        description: "Task updated sucesfully",
        status: "success",
      });

      const taskResult = await fetch(`/api/v1/task/${initialTask.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (taskResult.status === 200) {
        const data = await taskResult.json();
        setTask(data.task);
      }
    } else {
      toast({
        title: "Error",
        description: JSON.stringify(await result.json(), null, 2),
        status: "error",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleTaskSubmit}>
        <FormControl>
          <FormLabel>Name: </FormLabel>
          <Input name="name" defaultValue={initialTask.name}></Input>
          <FormLabel>Description: </FormLabel>
          <Input
            name="description"
            defaultValue={initialTask.description}
          ></Input>
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
      {task.fields.length > 0 &&
        task.fields.map((field: any, index: number) => (
          <TaskFieldForm
            buttonText="Update"
            handleSubmit={handleUpdateField}
            handleDelete={(e: any) => handleDelete(e, field.id)}
            field={field}
            key={index}
          />
        ))}
      <TaskFieldForm buttonText="Create" handleSubmit={handleCreateField} />
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const taskId = context.params.id;
  let task: any = await prisma.task.findUnique({
    where: {
      id: taskId,
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
        },
      },
    },
  });
  if (!task) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  task.dateStart =
    task.dateStart !== null
      ? toLocaleISOString(task.dateStart).substring(0, 16)
      : null;
  task.dateEnd = toLocaleISOString(task.dateEnd).substring(0, 16) || null;

  return {
    props: {
      initialTask: task,
    },
  };
};

export default TaskEditPage;
