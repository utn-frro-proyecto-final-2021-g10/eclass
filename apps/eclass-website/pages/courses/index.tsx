import {
  Box,
  useToast,
} from "@chakra-ui/react";
import { Course, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CourseForm from "../../components/Forms/CourseForm";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getFormValues } from "../../utils/getFormValues";

interface CoursesPageProps {
  initialCourses: Course[];
  users: User[];
}
const CoursesPage = ({ initialCourses, users }: CoursesPageProps) => {
  const me = useCurrentUser();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = getFormValues(formData);

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

  useEffect(() => {
    if (me && me.role !== "admin") {
      router.replace("/api/auth/signin");
    }
  }, [me, router]);

  return (
    <>
      <CourseForm users={users} handleSubmit={handleSubmit} />
      {me !== null &&
        courses &&
        courses.map((course: Course) => (
          <Box key={course.id}>
            <a
              href={`courses/${course.id}`}
            >{`${course.name} - ${course.description}`}</a>
          </Box>
        ))}
    </>
  );
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
