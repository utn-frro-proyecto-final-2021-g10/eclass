import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { Course, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getFormValues } from "../../utils/getFormValues";

interface CoursesPageProps {
  courses: Course[];
  users: User[];
}
const CoursesPage = ({ courses, users }: CoursesPageProps) => {
  const me = useCurrentUser();
  const router = useRouter();

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
        baseColor: values.color,
      },
    };

    const result = await fetch(`/api/v1/course`, {
      method: "POST",
      body: JSON.stringify(course),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(JSON.stringify(result, null, 2));
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
          <Input name="baseColor"></Input>
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
      courses,
      users,
    },
  };
};

export default CoursesPage;
