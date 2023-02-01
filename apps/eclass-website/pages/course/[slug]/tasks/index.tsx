import { prisma } from "../../../../lib/prisma";
import { CourseLayout } from "../../../../layouts/course-layout";
import { GridItem, useToast } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { TaskForm } from "../../../../components/pages/course/tasks/TaskForm";
import { TasksList } from "../../../../components/pages/course/tasks/TasksList";
import { eventToFormValues } from "../../../../utils/eventToFormValues";
import { useState } from "react";
import { useCurrentCourse } from "../../../../hooks/useCurrentCourse";

interface Props {
  course: any;
}
const Tasks = ({ course }: Props) => {
  const me = useCurrentUser();
  const toast = useToast();
  const [tasks, setTasks] = useState(course.tasks);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);
    const task = {
      name: values.name,
      description: values.description,
      dateStart: new Date(values.dateStart) || null,
      dateEnd: new Date(values.dateEnd),
      course: {
        connect: {
          id: course.id,
        },
      },
    };
    const result = await fetch(`/api/v1/task`, {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status === 200) {
      toast({
        title: "Creada",
        description: "La tarea se ha creado correctamente",
        status: "success",
        isClosable: true,
      });
      const tasksResult = await fetch(`/api/v1/course/${course.id}/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (tasksResult.status === 200) {
        const tasksData = await tasksResult.json();
        setTasks(tasksData.tasks);
      }
    } else {
      toast({
        title: "Error",
        description: "Error al crear la tarea",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      {me?.role == Role.professor && (
        <GridItem colSpan={12}>
          <TaskForm handleSubmit={handleSubmit} />
        </GridItem>
      )}

      <GridItem colSpan={12}>
        <TasksList tasks={tasks} course={course} />
      </GridItem>
    </>
  );
};

// @ts-ignore
Tasks.getLayout = function getLayout(page: ReactElement) {
  return <CourseLayout>{page}</CourseLayout>;
};

export const getServerSideProps = async (context: any) => {
  const course: any = await prisma.course.findUnique({
    where: {
      slug: context.params.slug,
    },
    include: {
      tasks: {
        where: {
          dateEnd: {
            gt: new Date(),
          },
          OR: [
            {
              dateStart: {
                lt: new Date(),
              },
            },
            {
              dateStart: null,
            },
          ],
        },
      },
    },
  });

  if (!course) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  course.tasks.forEach((task: any) => {
    task.dateStart = task.dateStart?.toISOString().substring(0, 10) || null;
    task.dateEnd = task.dateEnd.toISOString().substring(0, 10);
  });
  return {
    props: { course },
  };
};

export default Tasks;
