import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  useToast,
} from "@chakra-ui/react";
import { Color, Course, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

    let course = {
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
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Name: </FormLabel>
          <Input name="name"></Input>
          <FormLabel>Description: </FormLabel>
          <Input name="description"></Input>
          <FormLabel>Slug: </FormLabel>
          <Input name="slug"></Input>
          <FormLabel>More Info: </FormLabel>
          <Input name="moreInfo"></Input>
          <FormLabel>Image Url: </FormLabel>
          <Input name="imageUrl"></Input>
          <FormLabel>Enrollment ID: </FormLabel>
          <Input name="enrollmentId"></Input>
          <FormLabel>Owner: </FormLabel>
          <RadioGroup name="owner" display={"flex"} flexDir={"column"}>
            {users.map((user: any) => (
              <Radio
                key={user.id}
                value={user.id}
              >{`${user.id} - ${user.lastName}, ${user.firstName}`}</Radio>
            ))}
          </RadioGroup>
          <FormLabel>Color: </FormLabel>
          <RadioGroup name="color" display={"flex"} flexDir={"column"}>
            <Radio value={Color.blue}>{Color.blue}</Radio>
            <Radio value={Color.green}>{Color.green}</Radio>
            <Radio value={Color.orange}>{Color.orange}</Radio>
            <Radio value={Color.pink}>{Color.pink}</Radio>
            <Radio value={Color.purple}>{Color.purple}</Radio>
            <Radio value={Color.red}>{Color.red}</Radio>
            <Radio value={Color.yellow}>{Color.yellow}</Radio>
          </RadioGroup>
        </FormControl>
        <Button type="submit">Create</Button>
      </form>
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
  const users = await prisma.user.findMany({
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
      users,
    },
  };
};

export default CoursesPage;
