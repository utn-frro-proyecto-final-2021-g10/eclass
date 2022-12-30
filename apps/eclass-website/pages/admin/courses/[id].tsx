import { Button } from "@chakra-ui/react";
import { User, Role } from "@prisma/client";
import { useRouter } from "next/router";
import CourseForm from "../../../components/Forms/CourseForm";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { AdminLayout } from "../../../layouts/admin-layout";
import { eventToFormValues } from "../../../utils/eventToFormValues";

interface CoursePageProps {
  initialCourse: any;
  users: User[];
}

const CoursePage = ({ initialCourse, users }: CoursePageProps) => {
  const router = useRouter();
  useCurrentUser(Role.admin);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

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

    const response = await fetch(`/api/v1/course/${initialCourse.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedCourse),
      headers: {
        "Content-Type": "application/json",
      },
    });

    response.status === 200 && router.back();
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    const response = await fetch(`/api/v1/course/${initialCourse.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    response.status === 200 && router.back();

    return;
  };

  return (
    <>
      <CourseForm
        course={initialCourse}
        users={users}
        handleSubmit={handleSubmit}
        buttonText="Actualizar"
      >
        <Button variant={"ghost"} bg="red.200" onClick={handleDelete}>
          Eliminar
        </Button>
      </CourseForm>
    </>
  );
};

// @ts-ignore
CoursePage.getLayout = function getLayout(page: NextPage) {
  return <AdminLayout>{page}</AdminLayout>;
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
    props: { initialCourse: course, users: professors },
  };
};

export default CoursePage;
