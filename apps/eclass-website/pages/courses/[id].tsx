import {
  Button,
} from "@chakra-ui/react";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import CourseForm from "../../components/Forms/CourseForm";
import { getFormValues } from "../../utils/getFormValues";

interface CoursePageProps {
  course: any;
  users: User[];
}

const CoursePage = ({ course, users }: CoursePageProps) => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);

    const updatedCourse = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      moreInfo: values.moreInfo,
      imageUrl: values.imageUrl,
      enrollmentId: values.enrollmentId,
      ownerId: values.owner,
      settings: {
        update: {
          baseColor: values.color,
        },
      },
    };

    const result = await fetch(`/api/v1/course/${course.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedCourse),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status == 200) {
      router.reload();
    }
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    const result = await fetch(`/api/v1/course/${course.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status === 200) {
      router.back();
    }
    return;
  };

  return (
    <>
      <CourseForm course={course} users={users} handleSubmit={handleSubmit} />
      <Button variant={"ghost"} bg="red.200" onClick={handleDelete}>Delete</Button>
    </>
  )
};

export const getServerSideProps = async (context: any) => {
  const course: any = await prisma.course.findUnique({
    where: {
      id: context.params.id,
    },
    include: {
      settings: true,
      owner: {
        select: {
          firstName: true,
          lastName: true,
          id: true,
        },
      },
    },
  });
  const professors = await prisma.user.findMany({
    where: {
      role: "professor",
    },
    select: {
      firstName: true,
      lastName: true,
      id: true,
    },
  });

  return {
    props: { course, users: professors },
  };
};

export default CoursePage;
