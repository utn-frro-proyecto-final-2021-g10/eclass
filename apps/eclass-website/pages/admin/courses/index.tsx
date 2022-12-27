import { useToast } from "@chakra-ui/react";
import { Course, User, Role } from "@prisma/client";
import { useState } from "react";
import CourseForm from "../../../components/Forms/CourseForm";
import { Courses } from "../../../components/Listings/Courses";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { AdminLayout } from "../../../layouts/admin-layout";
import { eventToFormValues } from "../../../utils/eventToFormValues";

interface CoursesPageProps {
  initialCourses: Course[];
  users: User[];
}
const CoursesPage = ({ initialCourses, users }: CoursesPageProps) => {
  useCurrentUser(Role.admin);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = eventToFormValues(e);

    const course = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      moreInfo: values.moreInfo,
      imageUrl: values.imageUrl,
      enrollmentId: values.enrollmentId,
      ownerId: values.ownerId,
      settings: {
        create: {
          baseColor: values.color,
        },
      },
    };

    const result = await fetch(`/api/v1/course`, {
      method: "POST",
      body: JSON.stringify(course),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status === 200) {
      toast({
        title: "Created",
        description: "Course created succesfully",
        status: "success",
        isClosable: true,
      });

      const result = await fetch(`/api/v1/course`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.status === 200) {
        const data = await result.json();
        setCourses(data.courses);
      }
    } else {
      toast({
        title: "Error",
        description: "Error creating course",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <CourseForm users={users} handleSubmit={handleSubmit} />
      <Courses courses={courses} />
    </>
  );
};

// @ts-ignore
CoursesPage.getLayout = function getLayout(page: NextPage) {
  return <AdminLayout>{page}</AdminLayout>;
};

export const getServerSideProps = async () => {
  const courses = await prisma.course.findMany({
    select: {
      name: true,
      description: true,
      id: true,
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
    props: {
      initialCourses: courses,
      users: professors,
    },
  };
};

export default CoursesPage;
